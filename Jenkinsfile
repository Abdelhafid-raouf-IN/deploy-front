pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                git branch: 'main', url: 'https://github.com/Abdelhafid-raouf-IN/deploy-front.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                // Set up Node.js environment
                script {
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation' // Ensure 'NodeJS' matches the name configured in Jenkins
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                // Verify Node.js installation
                sh 'node --version'
                sh 'npm --version'
            }
        }

    }
}
