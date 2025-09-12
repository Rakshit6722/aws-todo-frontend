pipeline {
    agent any

    environment {
        S3_BUCKET = 'todo-frontend-2-123142141'
        AWS_REGION = 'us-west-2'
    }

    stages {

        stage('Clone the repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Rakshit6722/aws-todo-frontend.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([usernamePassword(credentialsId: 's3-cred', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        aws s3 sync build/ s3://${S3_BUCKET}/ --delete
                    '''
                }
            }
        }

        stage('CloudFront Invalidate') {
            steps {
                withCredentials([usernamePassword(credentialsId: 's3-cred', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=${AWS_REGION}
                        aws cloudfront create-invalidation --distribution-id E1Z74JRZYPRIJK --paths "/*"
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
