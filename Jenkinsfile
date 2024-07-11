pipeline {
    agent any

    environment {
        // Set the NVM directory and load NVM
        NVM_DIR = "$HOME/.nvm"
        PATH = "${NVM_DIR}/versions/node/v20.11.1/bin:$PATH"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install project dependencies using npm
                script {
                    sh '''
                    source $NVM_DIR/nvm.sh
                    if [ -f package-lock.json ]; then
                        npm ci
                    else
                        npm install
                    fi
                    '''
                }
            }
        }
        stage('Run Tests') {
            steps {
                // Run the project tests
                script {
                    sh 'source $NVM_DIR/nvm.sh && npm test'
                }
            }
        }
        stage('Build') {
            steps {
                // Build the project
                script {
                    sh 'source $NVM_DIR/nvm.sh && npm run build'
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                // Archive the build artifacts
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            }
        }
        stage('Deploy') {
            steps {
                // Deployment step (e.g., upload to a server or cloud provider)
                // You can add your deployment script here
                echo 'Deployment step'
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
