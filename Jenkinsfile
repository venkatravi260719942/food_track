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
        DOCKER_USERNAME = 'venkatravi26071994' // Docker Hub registry
        DOCKER_REPO = 'venkatravi26071994/food'        // Docker Hub repository
        COMPOSE_FILE = 'docker-compose.yml' // Docker Compose file for deployment
        USER = 'ubuntu'
        PEM = 'mumbai.pem'
        ENV_FILE = '.env'
    }
    stages {
        stage('CI: Checkout') {
            steps {
                checkout scm
            }
        }

        stage('CI: Build & Push Docker Images') {
            steps {
                script {
                    // Docker login securely using Jenkins credentials
                    withCredentials([string(credentialsId: 'DOCKERHUB_CREDENTIAL_ID', variable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login -u ${DOCKER_USERNAME} --password-stdin
                        '''
                    }
                    // Build Docker image for the client                    
                    sh "docker build -t ${DOCKER_REPO}:${CLIENT_IMAGE}${IMAGE_TAG} ./client"
                    // Build Docker image for the server
                    sh "docker build -t ${DOCKER_REPO}:${SERVER_IMAGE}${IMAGE_TAG} ./server"
                  
                    // Push Docker images to the registry
                    sh "docker push ${DOCKER_REPO}:${CLIENT_IMAGE}${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:${SERVER_IMAGE}${IMAGE_TAG}"
                }
            }
        }
        
        stage('SSH Docker Login') {
            steps {
                script {
                    sh "sudo chmod 400 ${PEM}"
                    sh '''
                        ssh -i ${PEM} ${USER}@${TARGET_HOST} "echo '$DOCKER_PASSWORD' | nohup docker login -u ${DOCKER_USERNAME} --password-stdin > /dev/null 2>&1 &"
                    '''
                }
            }
        }        
        
        stage('CD: Deploy to Target Host') {
            steps {
                script {
                   // Transfer the .env file to the target host
                    sh "scp -i ${PEM} ${ENV_FILE} ${USER}@${TARGET_HOST}:/home/ubuntu/.env"
                    
                    sh "scp -i ${PEM} ${COMPOSE_FILE} ${USER}@${TARGET_HOST}:/home/ubuntu/docker-compose.yml"
                    // Pull the Docker images on the Target VM
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}:${CLIENT_IMAGE}${IMAGE_TAG}'"
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}:${SERVER_IMAGE}${IMAGE_TAG}'"
                    
                    // Deploy the images using docker-compose on the Target VM
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker-compose -f /home/ubuntu/docker-compose.yml up -d'"
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
