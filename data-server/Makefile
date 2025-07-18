.PHONY: build run test clean docker-build docker-run help

# Variables
APP_NAME=blockchain-data-api
DOCKER_IMAGE=blockchain-data-api
PORT=8080

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build the application"
	@echo "  run          - Run the application locally"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"
	@echo "  deps         - Download dependencies"
	@echo "  fmt          - Format code"
	@echo "  lint         - Run linter"

# Build the application
build:
	@echo "Building $(APP_NAME)..."
	go build -o bin/$(APP_NAME) cmd/server/main.go

# Run the application
run:
	@echo "Running $(APP_NAME) on port $(PORT)..."
	go run cmd/server/main.go

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	go test -cover ./...

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	go clean

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	go mod tidy
	go mod download

# Format code
fmt:
	@echo "Formatting code..."
	go fmt ./...

# Run linter
lint:
	@echo "Running linter..."
	golangci-lint run

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE) .

# Run Docker container
docker-run:
	@echo "Running Docker container..."
	docker run -p $(PORT):$(PORT) $(DOCKER_IMAGE)

# Stop Docker container
docker-stop:
	@echo "Stopping Docker container..."
	docker stop $$(docker ps -q --filter ancestor=$(DOCKER_IMAGE))

# Remove Docker container
docker-clean:
	@echo "Removing Docker container..."
	docker rm $$(docker ps -aq --filter ancestor=$(DOCKER_IMAGE))

# Show logs
logs:
	@echo "Showing logs..."
	docker logs -f $$(docker ps -q --filter ancestor=$(DOCKER_IMAGE))

# Development with hot reload (requires air)
dev:
	@echo "Starting development server with hot reload..."
	air

# Install development tools
install-tools:
	@echo "Installing development tools..."
	go install github.com/cosmtrek/air@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Generate OpenAPI docs
docs:
	@echo "Generating OpenAPI documentation..."
	swag init -g cmd/server/main.go

# Install swagger
install-swagger:
	@echo "Installing swagger..."
	go install github.com/swaggo/swag/cmd/swag@latest 