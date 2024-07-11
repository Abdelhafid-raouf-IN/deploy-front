pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        PATH = "/root/.nvm/versions/node/v20.11.1/bin:${env.PATH}"  // Assurez-vous que ce chemin est correct
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
                // Print the PATH and which node and npm
                sh 'echo $PATH'
                sh 'which node'
                sh 'which npm'
                // Verify Node.js and npm installation
                sh 'node --version'
                sh 'npm --version'
            }
        }

        // Add more stages as needed
    }
}
