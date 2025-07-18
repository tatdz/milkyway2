package input

import (
	"context"

	"data-server/internal/domain/entities"
)

// EventService defines the interface for event-related use cases
type EventService interface {
	// GetAllEvents retrieves all events
	GetAllEvents(ctx context.Context) ([]entities.Event, error)
	
	// GetEventsByType retrieves events by event type
	GetEventsByType(ctx context.Context, eventType string) ([]entities.Event, error)
	
	// GetEventsByBlockRange retrieves events within a block range
	GetEventsByBlockRange(ctx context.Context, startBlock, endBlock int) ([]entities.Event, error)
	
	// GetEventsByCategory retrieves events by category (staking, governance, online, offence)
	GetEventsByCategory(ctx context.Context, category string) ([]entities.Event, error)
	
	// GetEventsByValidator retrieves events for a specific validator
	GetEventsByValidator(ctx context.Context, stash string) ([]entities.Event, error)
	
	// GetEventStats retrieves statistics about events
	GetEventStats(ctx context.Context) (*EventStats, error)
}

// EventStats represents statistics about events
type EventStats struct {
	TotalEvents     int                    `json:"total_events"`
	EventsByType    map[string]int         `json:"events_by_type"`
	EventsByCategory map[string]int        `json:"events_by_category"`
	EventsByBlock   map[int]int            `json:"events_by_block"`
	TotalAmount     int64                  `json:"total_amount"`
	UniqueValidators []string              `json:"unique_validators"`
} 