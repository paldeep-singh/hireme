#!/bin/bash
yum update -y
yum install -y docker aws-cli jq
systemctl start docker
systemctl enable docker

# Get credentials
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${api_server_ecr_url}

# Fetch secrets from SSM
DATABASE_URL=$(aws ssm get-parameter --name "db_url" --with-decryption --region ${AWS_REGION} | jq -r .Parameter.Value)

# Run container
docker pull ${api_server_ecr_url}:latest
docker run -d -p 80:3001 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e CORS_ORIGIN="https://paldeepsingh.dev" \
  ${api_server_ecr_url}:latest
