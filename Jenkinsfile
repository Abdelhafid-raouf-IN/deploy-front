pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                git 'https://github.com/Abdelhafid-raouf-IN/deploy-front.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                // Set up Node.js environment
                script {
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                // Verify Node.js installation
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                // Build the project
                sh 'npm run build'
            }
        }

        stage('Archive Build Artifacts') {
            steps {
                // Archive the build artifacts
                archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // Clean workspace after build
            cleanWs()
        }
        success {
            // Notify success (e.g., via email, Slack)
            echo 'Build succeeded!'
        }
        failure {
            // Notify failure (e.g., via email, Slack)
            echo 'Build failed!'
        }
    }
}
