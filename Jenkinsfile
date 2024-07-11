pipeline {
    agent any

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
                    if (fileExists('package-lock.json')) {
                        sh 'npm ci'
                    } else {
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                // Run the project tests
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                // Build the project
                sh 'npm run build'
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
