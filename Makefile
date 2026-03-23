# Makefile for nodejs-express-api
# Common development tasks

.PHONY: help install dev test lint security-scan docker-build docker-run clean

help:
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Run development server"
	@echo "  make test           - Run tests"
	@echo "  make lint           - Run linting"
	@echo "  make security-scan  - Run security scan"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make clean          - Clean temporary files"

install:
	npm install

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint || npx eslint . --fix

security-scan:
	npx grype . --config .grype.yaml || true

docker-build:
	docker build -t alexkore12/nodejs-express-api:latest .

docker-run:
	docker-compose up -d

clean:
	rm -rf node_modules/
	rm -rf .coverage
	rm -rf coverage/
	find . -name "*.log" -delete
