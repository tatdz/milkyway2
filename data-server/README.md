# Blockchain Data API

A Go-based REST API serving blockchain event data with hexagonal architecture, featuring realistic Substrate chain event logs for validator analysis.

## Architecture

This application follows hexagonal architecture (ports and adapters pattern):

```
├── cmd/
│   └── server/          # Application entry point
├── internal/
│   ├── domain/          # Business logic and entities
│   ├── ports/           # Interfaces (ports)
│   │   ├── input/       # Input ports (use cases)
│   │   └── output/      # Output ports (repositories)
│   └── adapters/
│       ├── input/       # Input adapters (HTTP handlers)
│       └── output/      # Output adapters (data sources)
├── pkg/                 # Shared packages
└── docs/               # OpenAPI specification
```

## Features

- **Hexagonal Architecture**: Clean separation of concerns with ports and adapters
- **RESTful API**: Comprehensive endpoints for blockchain data
- **OpenAPI Specification**: Complete API documentation
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: Service health monitoring
- **Structured Logging**: Comprehensive logging with different levels

## API Endpoints

### Validators
- `GET /api/v1/validators` - Get all validators
- `GET /api/v1/validators/{type}` - Get specific validator (good/neutral/bad)
- `GET /api/v1/validators/{type}/events` - Get events for specific validator

### Events
- `GET /api/v1/events` - Get events with optional filtering
- `GET /api/v1/events/{eventType}` - Get events by event type
- `GET /api/v1/events/blocks/{start}/{end}` - Get events by block range

### System
- `GET /api/v1/health` - Health check
- `GET /api/v1/metrics` - Service metrics

## Getting Started

### Prerequisites
- Go 1.21 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blockchain-data-api
```

2. Install dependencies:
```bash
go mod tidy
```

3. Run the application:
```bash
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`

### Docker

Build and run with Docker:

```bash
docker build -t blockchain-data-api .
docker run -p 8080:8080 blockchain-data-api
```

## API Documentation

Once the server is running, you can access:
- OpenAPI Specification: `http://localhost:8080/docs`
- Swagger UI: `http://localhost:8080/swagger`

## Example Usage

### Get all validators
```bash
curl http://localhost:8080/api/v1/validators
```

### Get good validator events
```bash
curl http://localhost:8080/api/v1/validators/good/events
```

### Get staking events
```bash
curl http://localhost:8080/api/v1/events/staking.Bonded
```

## Data Structure

The API serves three types of validators:

1. **Good Validator** (`5F3sa2TJc...Good`)
   - Active every session
   - Regular voter and delegate
   - Always online, no slashes
   - Earns consistent rewards

2. **Neutral Validator** (`5DAAnrj7V...Neutral`)
   - Mostly consistent session participation
   - Rarely participates in governance
   - Not optimal but no slashing

3. **Bad Validator** (`5HGjWAeFD...Bad`)
   - Irregular session participation
   - Never votes
   - Slashed, disabled, eventually chilled

## Development

### Project Structure
```
.
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── domain/
│   │   ├── entities/
│   │   └── valueobjects/
│   ├── ports/
│   │   ├── input/
│   │   └── output/
│   └── adapters/
│       ├── input/
│       └── output/
├── pkg/
│   ├── logger/
│   └── response/
├── docs/
│   └── openapi.yaml
├── go.mod
├── go.sum
└── README.md
```

### Adding New Features

1. Define domain entities in `internal/domain/entities/`
2. Create use cases in `internal/ports/input/`
3. Implement handlers in `internal/adapters/input/`
4. Add repository interfaces in `internal/ports/output/`
5. Implement data sources in `internal/adapters/output/`

## Testing

Run tests:
```bash
go test ./...
```

Run tests with coverage:
```bash
go test -cover ./...
```

## License

MIT License 