pipeline {
    environment {
      registry = "1p22geo/networksim"
      registryCredential = 'dockerhub_id'
      dockerImage = ''
    }
    agent any
    stages {
        stage('Install deps') {
            steps {
              sh 'yarn install'
            }
        }
        stage('Static format checks') {
            steps {
              sh 'yarn format'
            }
        }
        stage('Bundle and compress app') {
            steps {
              sh 'tar --exclude=node_modules -czvf networksim.tar.gz *'
              archiveArtifacts artifacts: 'networksim.tar.gz'
            }
        }
        stage('Build Docker image'){
          steps {
            script {
              if (env.BRANCH_NAME == 'master'){
                dockerImage = docker.build "1p22geo/networksim:latest"
              }
            }
          }
        }
        stage('Push image'){
          steps {
            script {
              if (env.BRANCH_NAME == 'master'){
                docker.withRegistry( '', registryCredential ) {
                  dockerImage.push()
                }
              }
            }
          }
        }
    }
}
