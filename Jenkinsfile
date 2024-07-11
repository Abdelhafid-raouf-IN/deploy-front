pipeline {
    agent any

    environment {
        // Define environment variables if needed
        FRONTEND_REPO = 'https://github.com/yourusername/frontend-repo.git'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: "${env.FRONTEND_REPO}", branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: true
            }
        }

        stage('Deploy') {
            steps {
                // Add deployment steps here, e.g., copy files to the server, deploy to a cloud platform, etc.
                echo 'Deploying the application...'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
