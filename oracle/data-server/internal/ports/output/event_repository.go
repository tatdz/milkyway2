package output

import (
	"context"

	"data-server/internal/domain/entities"
)

// EventRepository defines the interface for event data access
type EventRepository interface {
	// GetAll retrieves all events
	GetAll(ctx context.Context) ([]entities.Event, error)
	
	// GetByType retrieves events by event type
	GetByType(ctx context.Context, eventType string) ([]entities.Event, error)
	
	// GetByBlockRange retrieves events within a block range
	GetByBlockRange(ctx context.Context, startBlock, endBlock int) ([]entities.Event, error)
	
	// GetByValidator retrieves events for a specific validator
	GetByValidator(ctx context.Context, stash string) ([]entities.Event, error)
	
	// GetByCategory retrieves events by category
	GetByCategory(ctx context.Context, category string) ([]entities.Event, error)
	
	// Save saves an event
	Save(ctx context.Context, event *entities.Event) error
	
	// SaveBatch saves multiple events
	SaveBatch(ctx context.Context, events []entities.Event) error
} 