pipeline {
    agent any
    parameters {
        string(name: 'TARGET_HOST', defaultValue: 'dev-vm-ip', description: 'Target VM IP Address for Deployment')
        file(name: 'ENV_FILE', description: '.env file for configuration')
        string(name: 'IMAGE_TAG', defaultValue: "${env.BUILD_ID}", description: 'Docker image tag (default: Build ID)')
    }
    environment {
        CLIENT_IMAGE = 'foodtrack-client'   // Docker image for client
        SERVER_IMAGE = 'foodtrack-server'   // Docker image for server
        DOCKER_REGISTRY = 'venkatravi26071994'       // Docker Hub registry
        DOCKER_REPO = 'food'        // Docker Hub repository
        COMPOSE_FILE = 'docker-compose.yml' // Docker Compose file for deployment
        USER= 'ubuntu'
        PEM= 'mumbai.pem'

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
                    // Docker login (ensure you have the Docker credentials set in Jenkins)
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}"
                    }
                    
                    // Build Docker image for the client and server
                    sh "docker build -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/${CLIENT_IMAGE}:${IMAGE_TAG} ./client"
                    sh "docker build -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG} ./server"
                    
                    // Push Docker images to the registry
                    sh "docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/${CLIENT_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG}"
                }
            }
        }
        
        stage('CD: Deploy to Target Host') {
            steps {
                script {
                    // Docker login for deployment (ensure same Docker credentials)
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY}'"
                    }

                    // Transfer the .env file to the target host
                    sh "scp ${ENV_FILE} ${USER}@${TARGET_HOST}:/home/ubuntu/.env"
                    
                    // Pull the Docker images on the Target VM
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REGISTRY}/${DOCKER_REPO}/${CLIENT_IMAGE}:${IMAGE_TAG}'"
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker pull ${DOCKER_REGISTRY}/${DOCKER_REPO}/${SERVER_IMAGE}:${IMAGE_TAG}'"
                    
                    // Deploy the images using docker-compose on the Target VM
                    sh "ssh -i ${PEM} ${USER}@${TARGET_HOST} 'docker-compose -f ${COMPOSE_FILE} up -d'"
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
