pipeline {
    agent any   
        tools{
             nodejs 'node'
             
        }
        environment {
            SCANNER_HOME= tool 'sonar-scanner'
        } 
    stages {
        stage('Git Checkout') {
            steps {
                   checkout(
          scm: [
            $class: 'GitSCM',
            branches: [[name: 'origin/main']], // Specify branch to checkout
            userRemoteConfigs: [[url: 'http://167.235.49.72:3000/arunkumar/foodtraczz.git', credentialsId: 'CI/CD']]
          ]
        ) 
            }
        }
        stage('Compile') {
            steps {
               echo "compiled using build automation tool" 
            }
        }
        stage('Sonarqube Frontend Analysis'){
       
            steps {
                  sh '''
                    npx sonarqube-scanner -Dsonar.host.url=http://167.235.49.72:9000/ \
                    -Dsonar.login=sqp_06f9f63ad2b2e17ff1540aa6293dbd43b2a554e1 \
                    -Dsonar.projectName=foddtracz\
                    -Dsonar.projectKey=foddtracz \
                    -Dsonar.sources=/var/lib/jenkins/workspace/foodtracz_CI_pipeline/client
                    '''
             }
        }
         stage('Sonarqube Backend Analysis'){
            steps {
                  sh '''
                    npx sonarqube-scanner -Dsonar.host.url=http://167.235.49.72:9000/ \
                    -Dsonar.login=sqp_06f9f63ad2b2e17ff1540aa6293dbd43b2a554e1 \
                    -Dsonar.projectName=foddtracz \
                    -Dsonar.projectKey=foddtracz\
                    -Dsonar.sources=/var/lib/jenkins/workspace/foodtracz_CI_pipeline/server
                    '''
            }
        }
      
          stage('Install Dependencies'){
            steps {
            dir('client') {
                    sh 'npm install'
            }
            dir('server') {
                    sh 'npm install'
            }
                }
        }
       
        // stage('Trigger CD Pipeline'){
        //     steps {
        //         build job: "CD_Pipeline", wait: true
        //         }
        // }
    }
    post { 
            always { 
                    emailext(
                        subject:"${BUILD_TAG} Build report",
                        body:'''<html>
                                    <body>
                                      <div>
                                   Hi,
                                    <p> Please find the last build job details below.</p>
                                        <p>Build Status:<b>${BUILD_STATUS}</b></p>
                                        <p>Build Number:${BUILD_NUMBER}</p>
                                        <p>Check the <a href="${BUILD_URL}"> console output here.</a></p>
                                    
                                    Thanks!
                                      </div>
                                    Note:This is an automated email
                                    </body>
                                </html>''',
                        to: 'arunkumar.krishnasamy@adept-view.com', 
                        from: 'arunkumar.krishnasamy@adept-view.com',
                        replyTo:'arunkumar.krishnasamy@adept-view.com', 
                        mimeType: 'text/html'
                    )
            }
    }
}
