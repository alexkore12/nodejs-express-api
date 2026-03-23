#!/bin/bash
# Deploy script for nodejs-express-api
# Usage: ./deploy.sh [environment]

set -euo pipefail

ENVIRONMENT="${1:-development}"
PROJECT_NAME="nodejs-express-api"
DOCKER_IMAGE="alexkore12/${PROJECT_NAME}:latest"

echo "🚀 Deploying ${PROJECT_NAME} to ${ENVIRONMENT}"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    export $(cat ".env.${ENVIRONMENT}" | grep -v '^#' | xargs)
    echo "✅ Loaded environment from .env.${ENVIRONMENT}"
fi

# Build Docker image
echo "📦 Building Docker image..."
docker build -t "${DOCKER_IMAGE}" .

# Run health check
echo "🏥 Running health check..."
node health_check.js 2>/dev/null || python3 health_check.py 2>/dev/null || curl -s http://localhost:3000/health

# Deploy based on environment
case "${ENVIRONMENT}" in
    production)
        echo "🏭 Deploying to production..."
        docker build -t "${PROJECT_NAME}:prod" .
        docker-compose -f docker-compose.prod.yaml up -d
        ;;
    staging)
        echo "🧪 Deploying to staging..."
        docker-compose up -d
        ;;
    development)
        echo "🧑‍💻 Deploying to development..."
        docker-compose up -d
        ;;
    *)
        echo "❌ Unknown environment: ${ENVIRONMENT}"
        exit 1
        ;;
esac

echo "✅ Deployment complete!"
echo "🌐 API running at http://localhost:3000"