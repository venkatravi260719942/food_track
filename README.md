Here’s a detailed `README.md` file to help document the entire setup process, from VM creation to the Jenkins pipeline for deployment:

```markdown
# Food Tracking CI/CD Pipeline Documentation

This document provides a detailed walkthrough of the infrastructure and setup for deploying the Food Tracking application using Jenkins, Docker, and Docker Compose. The pipeline automates the process of building, pushing, and deploying Docker containers to a target VM.

## Prerequisites

Before setting up the CI/CD pipeline, ensure that the following components are available:

- **VMs**: A target VM for deployment and a Jenkins slave VM
- **Docker**: Docker must be installed on the target VM and Jenkins slave VM
- **Jenkins**: Jenkins with necessary plugins (e.g., SSH, Docker, GitHub integration)
- **AWS CLI**: For interaction with AWS services (if using S3 or EC2)
- **Docker Hub**: A Docker Hub account for image storage

```
## Steps

### 1. VM Creation

Create two Ubuntu-based EC2 instances:
- **Target VM**: For application deployment using Docker.
- **Jenkins Slave VM**: A secondary Jenkins node for executing the pipeline.

Use the following steps to create these VMs:
1. **Create EC2 Instances**:
   - Log into the AWS Management Console.
   - Navigate to EC2 > Instances > Launch Instance.
   - Select the **Ubuntu Server** image (preferably the latest LTS version).
   - Assign security groups to allow SSH access and HTTP/HTTPS for your app.
   - Note the **Public IP** and **Private Key** (`.pem` file) for SSH access.

2. **Connect to VMs**:
   - SSH into the instances using the following command:
     ```bash
     ssh -i /path/to/your-key.pem ubuntu@<target-vm-ip>
     ```


### 2. Install Software on Target VM

1. **Install Docker and Docker Compose**:
   SSH into your target VM and execute the following commands:

   ```bash
   sudo apt update
   sudo apt install -y docker.io
   sudo systemctl enable --now docker
   sudo apt install -y docker-compose
   ```

2. **Install AWS CLI (Optional, for S3 Integration)**:
   If you are using AWS services like S3:
   ```bash
   sudo apt install awscli
   ```

### 3. Install Software on Jenkins Slave VM

1. **Install Docker**:
   Follow the same steps as for the target VM to install Docker and Docker Compose.

2. **Configure Jenkins Agent**:
   - Add the Jenkins slave as a node in the Jenkins master.
   - Install the required Jenkins plugins (e.g., Docker, GitHub, SSH, etc.).

### 4. Jenkins Pipeline Setup

The pipeline automates the following tasks:

- **Code Checkout**: Pulls the latest code from GitHub.
- **Docker Image Build & Push**: Builds the Docker images for both the client and server, then pushes them to Docker Hub.
- **Docker Login on Target Host**: Logs in to Docker on the target host using SSH.
- **Environment File & Docker Compose Transfer**: Transfers the `.env` and `docker-compose.yaml` files to the target host.
- **Application Deployment**: Deploys the application using `docker-compose`.
- **Cleanup**: Stops and removes old containers and images from both the Jenkins slave and the target host.

#### Jenkinsfile


https://raw.githubusercontent.com/venkatravi260719942/food_track/refs/heads/main/Jenkinsfile


### 5. Post-Deployment Cleanup

The pipeline also ensures that old containers and images are deleted after a successful deployment, both on the Jenkins slave and target host. This helps maintain a clean environment.

- **Remove Old Containers**:
   The pipeline stops and removes old containers using `docker stop` and `docker rm`.

- **Remove Old Images**:
   Old images are removed with `docker rmi`.

---

### Conclusion

With this CI/CD pipeline, you can automate the process of deploying your Food Tracking application. The process includes code checkout, Docker image build and push, deployment using Docker Compose, and post-deployment cleanup.

---


