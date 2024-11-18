pipeline {
    agent any
    parameters {
        string(name: 'TARGET_HOST', defaultValue: 'dev-vm-ip', description: 'Target VM IP Address for Deployment')
        string(name: 'IMAGE_TAG', defaultValue: "${env.BUILD_ID}", description: 'Docker image tag (default: Build ID)')
    }
    environment {
        CLIENT_IMAGE = 'foodtrack-client'   // Docker image for client
        SERVER_IMAGE = 'foodtrack-server'   // Docker image for server
        DOCKER_USERNAME = 'venkatravi26071994' // Docker Hub registry
        DOCKER_PASSWORD = 'dckr_pat_JTrli2BddxJ6px99ia7M8j0z7K8'
        DOCKER_REPO = 'food'        // Docker Hub repository
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

        stage('SSH Docker Login') {
            steps {
                script {
                    sh """
                        ssh -i ${PEM} ${USER}@${TARGET_HOST} \\
                        'docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}'
                    """
                }
            }
        }        
        
        stage('CI: Build & Push Docker Images') {
            steps {
                script {
                    // Docker login 
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    // Build Docker image for the client                    
                    sh "docker build -t ${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG} ./client"
                   // Build Docker image for the client and server
                    sh "docker build -t ${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG} ./server"
                  
                    // Push Docker images to the registry
                    sh "docker push ${DOCKER_REPO}/${CLIENT_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG}"
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
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}/${CLIENT_IMAGE}:${IMAGE_TAG}'"
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG}'"
                    
                    // Deploy the images using docker-compose on the Target VM
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} '/home/ubuntu/docker-compose.yml up -d'"
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
