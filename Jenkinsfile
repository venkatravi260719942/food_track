pipeline {
    agent {
        label 'slave' // Use the specific agent
    }
    parameters {
        string(name: 'TARGET_HOST', defaultValue: '13.203.76.79', description: 'Target VM IP Address for Deployment')
        string(name: 'IMAGE_TAG', defaultValue: "v1.0.${env.BUILD_ID}", description: 'Docker image tag (default: Build ID)')
    }
    environment {
        CLIENT_IMAGE = 'foodtrack-client'   // Docker image for client
        SERVER_IMAGE = 'foodtrack-server'   // Docker image for server
        DOCKER_REPO = 'venkatravi26071994/food' // Docker Hub repository
        COMPOSE_FILE = 'docker-compose.yaml' // Docker Compose file for deployment
        ENV_FILE = '.env' // Path to .env file
        ENV_FILE_PATH = '/home/ubuntu/.env' // Path to .env on target host
        USER = 'ubuntu'
        PEM_FILE = '/home/ubuntu/mumbai.pem' // Path to the .pem file
    }
    stages {
        stage('CI: Checkout') {
            steps {
                script {
                    // Checkout the code using GitHub credentials
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: '*/main']],
                            userRemoteConfigs: [[
                                url: 'https://github.com/venkatravi260719942/food_track.git',
                                credentialsId: 'github'
                            ]]
                        ])
                    }
                }
            }
        }

        stage('CI: Build & Push Docker Images') {
            steps {
                script {
                    // Docker login securely using Jenkins credentials
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        '''
                    }
                    // Build Docker images
                    sh "docker build -t ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG} ./client"
                    sh "docker build -t ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG} ./server"
                  
                    // Push Docker images to the registry
                    sh "docker push ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG}"
                }
            }
        }
        
        stage('SSH Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            chmod 400 ${PEM_FILE}
                            ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} "echo '$DOCKER_PASSWORD' | docker login -u '$DOCKER_USERNAME' --password-stdin"
                        '''
                    }
                }
            }
        }        
        
        stage('CD: Deploy to Target Host') {
            steps {
                script {
                    sh '''
                        # Print out the environment variables in Jenkins
                        echo "IMAGE_TAG=${IMAGE_TAG}"
                        echo "DOCKER_REPO=${DOCKER_REPO}"
                        echo "CLIENT_IMAGE=${CLIENT_IMAGE}"
                        echo "SERVER_IMAGE=${SERVER_IMAGE}"

                        # Transfer necessary files to the target host
                        scp -i ${PEM_FILE} ${ENV_FILE} ${USER}@${TARGET_HOST}:${ENV_FILE_PATH}
                    '''
                }
            }
        }

        stage('Generate docker-compose.yaml') {
            steps {
                script {
                    // Write docker-compose file dynamically
                    def dockerComposeContent = """
version: '3.8'

services:
  client:
    image: ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG}
    container_name: ${CLIENT_IMAGE}
    ports:
      - "3000:3000"
    environment:
      - ENV_FILE_PATH=${ENV_FILE_PATH}  # Pass .env file path to the container

  server:
    image: ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG}
    container_name: ${SERVER_IMAGE}
    ports:
      - "5000:5000"
    environment:
      - ENV_FILE_PATH=${ENV_FILE_PATH}  # Pass .env file path to the container

networks:
  default:
    external:
      name: food
                    """
                    // Write the content to a docker-compose.yaml file
                    writeFile(file: 'docker-compose.yaml', text: dockerComposeContent)
                }
            }
        }

        stage('Delete Existing Containers') {
            steps {
                script {
                    // SSH into target host and stop and remove any existing containers before deployment
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            docker ps -a -q --filter "name=${CLIENT_IMAGE}" | xargs -r docker stop
                            docker ps -a -q --filter "name=${CLIENT_IMAGE}" | xargs -r docker rm
                            docker ps -a -q --filter "name=${SERVER_IMAGE}" | xargs -r docker stop
                            docker ps -a -q --filter "name=${SERVER_IMAGE}" | xargs -r docker rm
                        '
                    """
                }
            }
        }


        stage('Copy docker-compose.yaml and .env to target host') {
            steps {
                script {
                    // Copy docker-compose.yaml and .env file to the target host
                    sh "scp -i ${PEM_FILE} docker-compose.yaml ${USER}@${TARGET_HOST}:/home/ubuntu/docker-compose.yaml"
                    sh "scp -i ${PEM_FILE} .env ${USER}@${TARGET_HOST}:${ENV_FILE_PATH}"
                }
            }
        }

        stage('Deploy using docker-compose on target host') {
            steps {
                script {
                    // SSH into target host and run docker-compose
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            export IMAGE_TAG=${IMAGE_TAG}
                            export DOCKER_REPO=${DOCKER_REPO}
                            export CLIENT_IMAGE=${CLIENT_IMAGE}
                            export SERVER_IMAGE=${SERVER_IMAGE}
                            echo "Using IMAGE_TAG=\$IMAGE_TAG"
                            echo "Using DOCKER_REPO=\$DOCKER_REPO"
                            echo "Using CLIENT_IMAGE=\$CLIENT_IMAGE"
                            echo "Using SERVER_IMAGE=\$SERVER_IMAGE"
                            cd /home/ubuntu && docker-compose -f docker-compose.yaml up -d
                        '
                    """
                }
            }
        }

        stage('Delete Images from Target Host and Slave') {
            steps {
                script {
                    // Remove images from the target host by explicitly listing them
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            CLIENT_IMAGES=\$(docker images --filter "reference=${DOCKER_REPO}:${CLIENT_IMAGE}-*" -q)
                            SERVER_IMAGES=\$(docker images --filter "reference=${DOCKER_REPO}:${SERVER_IMAGE}-*" -q)
                            
                            if [ -n "\$CLIENT_IMAGES" ]; then
                                echo "Removing client images: \$CLIENT_IMAGES"
                                docker rmi -f \$CLIENT_IMAGES || true
                            fi
                            
                            if [ -n "\$SERVER_IMAGES" ]; then
                                echo "Removing server images: \$SERVER_IMAGES"
                                docker rmi -f \$SERVER_IMAGES || true
                            fi
                        '
                    """
                    
                    // Remove images from Jenkins slave (if applicable)
                    sh '''
                        CLIENT_IMAGES=$(docker images --filter "reference=${DOCKER_REPO}:${CLIENT_IMAGE}-*" -q)
                        SERVER_IMAGES=$(docker images --filter "reference=${DOCKER_REPO}:${SERVER_IMAGE}-*" -q)

                        if [ -n "$CLIENT_IMAGES" ]; then
                            echo "Removing client images: $CLIENT_IMAGES"
                            docker rmi -f $CLIENT_IMAGES || true
                        fi

                        if [ -n "$SERVER_IMAGES" ]; then
                            echo "Removing server images: $SERVER_IMAGES"
                            docker rmi -f $SERVER_IMAGES || true
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Build and Deployment successful!"
        }
        failure {
            echo "Build or Deployment failed."
        }
    }
}
pipeline {
    agent {
        label 'slave' // Use the specific agent
    }
    parameters {
        string(name: 'TARGET_HOST', defaultValue: '13.203.76.79', description: 'Target VM IP Address for Deployment')
        string(name: 'IMAGE_TAG', defaultValue: "v1.0.${env.BUILD_ID}", description: 'Docker image tag (default: Build ID)')
    }
    environment {
        CLIENT_IMAGE = 'foodtrack-client'   // Docker image for client
        SERVER_IMAGE = 'foodtrack-server'   // Docker image for server
        DOCKER_REPO = 'venkatravi26071994/food' // Docker Hub repository
        COMPOSE_FILE = 'docker-compose.yaml' // Docker Compose file for deployment
        ENV_FILE = '.env' // Path to .env file
        ENV_FILE_PATH = '/home/ubuntu/.env' // Path to .env on target host
        USER = 'ubuntu'
        PEM_FILE = '/home/ubuntu/mumbai.pem' // Path to the .pem file
    }
    stages {
        stage('CI: Checkout') {
            steps {
                script {
                    // Checkout the code using GitHub credentials
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: '*/main']],
                            userRemoteConfigs: [[
                                url: 'https://github.com/venkatravi260719942/food_track.git',
                                credentialsId: 'github'
                            ]]
                        ])
                    }
                }
            }
        }

        stage('CI: Build & Push Docker Images') {
            steps {
                script {
                    // Docker login securely using Jenkins credentials
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        '''
                    }
                    // Build Docker images
                    sh "docker build -t ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG} ./client"
                    sh "docker build -t ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG} ./server"
                  
                    // Push Docker images to the registry
                    sh "docker push ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG}"
                }
            }
        }
        
        stage('SSH Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            chmod 400 ${PEM_FILE}
                            ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} "echo '$DOCKER_PASSWORD' | docker login -u '$DOCKER_USERNAME' --password-stdin"
                        '''
                    }
                }
            }
        }        
        
        stage('CD: Deploy to Target Host') {
            steps {
                script {
                    sh '''
                        # Print out the environment variables in Jenkins
                        echo "IMAGE_TAG=${IMAGE_TAG}"
                        echo "DOCKER_REPO=${DOCKER_REPO}"
                        echo "CLIENT_IMAGE=${CLIENT_IMAGE}"
                        echo "SERVER_IMAGE=${SERVER_IMAGE}"

                        # Transfer necessary files to the target host
                        scp -i ${PEM_FILE} ${ENV_FILE} ${USER}@${TARGET_HOST}:${ENV_FILE_PATH}
                    '''
                }
            }
        }

        stage('Generate docker-compose.yaml') {
            steps {
                script {
                    // Write docker-compose file dynamically
                    def dockerComposeContent = """
version: '3.8'

services:
  client:
    image: ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG}
    container_name: ${CLIENT_IMAGE}
    ports:
      - "3000:3000"
    environment:
      - ENV_FILE_PATH=${ENV_FILE_PATH}  # Pass .env file path to the container

  server:
    image: ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG}
    container_name: ${SERVER_IMAGE}
    ports:
      - "5000:5000"
    environment:
      - ENV_FILE_PATH=${ENV_FILE_PATH}  # Pass .env file path to the container

networks:
  default:
    external:
      name: food
                    """
                    // Write the content to a docker-compose.yaml file
                    writeFile(file: 'docker-compose.yaml', text: dockerComposeContent)
                }
            }
        }

        stage('Delete Existing Containers') {
            steps {
                script {
                    // SSH into target host and stop and remove any existing containers before deployment
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            docker ps -a -q --filter "name=${CLIENT_IMAGE}" | xargs -r docker stop
                            docker ps -a -q --filter "name=${CLIENT_IMAGE}" | xargs -r docker rm
                            docker ps -a -q --filter "name=${SERVER_IMAGE}" | xargs -r docker stop
                            docker ps -a -q --filter "name=${SERVER_IMAGE}" | xargs -r docker rm
                        '
                    """
                }
            }
        }


        stage('Copy docker-compose.yaml and .env to target host') {
            steps {
                script {
                    // Copy docker-compose.yaml and .env file to the target host
                    sh "scp -i ${PEM_FILE} docker-compose.yaml ${USER}@${TARGET_HOST}:/home/ubuntu/docker-compose.yaml"
                    sh "scp -i ${PEM_FILE} .env ${USER}@${TARGET_HOST}:${ENV_FILE_PATH}"
                }
            }
        }

        stage('Deploy using docker-compose on target host') {
            steps {
                script {
                    // SSH into target host and run docker-compose
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            export IMAGE_TAG=${IMAGE_TAG}
                            export DOCKER_REPO=${DOCKER_REPO}
                            export CLIENT_IMAGE=${CLIENT_IMAGE}
                            export SERVER_IMAGE=${SERVER_IMAGE}
                            echo "Using IMAGE_TAG=\$IMAGE_TAG"
                            echo "Using DOCKER_REPO=\$DOCKER_REPO"
                            echo "Using CLIENT_IMAGE=\$CLIENT_IMAGE"
                            echo "Using SERVER_IMAGE=\$SERVER_IMAGE"
                            cd /home/ubuntu && docker-compose -f docker-compose.yaml up -d
                        '
                    """
                }
            }
        }

        stage('Delete Images from Target Host and Slave') {
            steps {
                script {
                    // Remove images from the target host by explicitly listing them
                    sh """
                        ssh -i ${PEM_FILE} ${USER}@${TARGET_HOST} '
                            CLIENT_IMAGES=\$(docker images --filter "reference=${DOCKER_REPO}:${CLIENT_IMAGE}-*" -q)
                            SERVER_IMAGES=\$(docker images --filter "reference=${DOCKER_REPO}:${SERVER_IMAGE}-*" -q)
                            
                            if [ -n "\$CLIENT_IMAGES" ]; then
                                echo "Removing client images: \$CLIENT_IMAGES"
                                docker rmi -f \$CLIENT_IMAGES || true
                            fi
                            
                            if [ -n "\$SERVER_IMAGES" ]; then
                                echo "Removing server images: \$SERVER_IMAGES"
                                docker rmi -f \$SERVER_IMAGES || true
                            fi
                        '
                    """
                    
                    // Remove images from Jenkins slave (if applicable)
                    sh '''
                        CLIENT_IMAGES=$(docker images --filter "reference=${DOCKER_REPO}:${CLIENT_IMAGE}-*" -q)
                        SERVER_IMAGES=$(docker images --filter "reference=${DOCKER_REPO}:${SERVER_IMAGE}-*" -q)

                        if [ -n "$CLIENT_IMAGES" ]; then
                            echo "Removing client images: $CLIENT_IMAGES"
                            docker rmi -f $CLIENT_IMAGES || true
                        fi

                        if [ -n "$SERVER_IMAGES" ]; then
                            echo "Removing server images: $SERVER_IMAGES"
                            docker rmi -f $SERVER_IMAGES || true
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Build and Deployment successful!"
        }
        failure {
            echo "Build or Deployment failed."
        }
    }
}
