pipeline {
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
    }
}
