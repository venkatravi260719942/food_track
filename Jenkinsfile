pipeline {
    agent {
        label 'slave' // Use the specific agent
    }
    parameters {
        string(name: 'TARGET_HOST', defaultValue: '13.203.76.79', description: 'Target VM IP Address for Deployment')
        string(name: 'IMAGE_TAG', defaultValue: "v${env.BUILD_ID}", description: 'Docker image tag (default: Build ID)')
    }
    environment {
        CLIENT_IMAGE = 'foodtrack-client'   // Docker image for client
        SERVER_IMAGE = 'foodtrack-server'   // Docker image for server
        DOCKER_REPO = 'venkatravi26071994/food' // Docker Hub repository
        COMPOSE_FILE = 'docker-compose.yml' // Docker Compose file for deployment
        ENV_FILE = '.env'
        USER = 'ubuntu'
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
                                url: 'https://github.com/your-repo.git',
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
                    withCredentials([sshUserPrivateKey(credentialsId: 'TARGET_SSH_CREDENTIAL', keyFileVariable: 'SSH_KEY')]) {
                        withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh '''
                                chmod 400 $SSH_KEY
                                ssh -i $SSH_KEY ${USER}@${TARGET_HOST} "echo '$DOCKER_PASSWORD' | docker login -u '$DOCKER_USERNAME' --password-stdin"
                            '''
                        }
                    }
                }
            }
        }        
        
        stage('CD: Deploy to Target Host') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'TARGET_SSH_CREDENTIAL', keyFileVariable: 'SSH_KEY')]) {
                        sh '''
                            # Transfer necessary files to the target host
                            scp -i $SSH_KEY ${ENV_FILE} ${USER}@${TARGET_HOST}:/home/ubuntu/.env
                            scp -i $SSH_KEY ${COMPOSE_FILE} ${USER}@${TARGET_HOST}:/home/ubuntu/docker-compose.yml
                            
                            # Pull Docker images on the target host
                            ssh -i $SSH_KEY ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}:${CLIENT_IMAGE}-${IMAGE_TAG}'
                            ssh -i $SSH_KEY ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}:${SERVER_IMAGE}-${IMAGE_TAG}'
                            
                            # Deploy the application using docker-compose
                            ssh -i $SSH_KEY ${USER}@${TARGET_HOST} 'docker-compose -f /home/ubuntu/docker-compose.yml up -d'
                        '''
                    }
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
