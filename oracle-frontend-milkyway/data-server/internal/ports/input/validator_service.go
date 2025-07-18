package input

import (
	"context"

	"data-server/internal/domain/entities"
)

// ValidatorService defines the interface for validator-related use cases
type ValidatorService interface {
	// GetAllValidators retrieves all validators
	GetAllValidators(ctx context.Context) ([]*entities.Validator, error)
	
	// GetValidatorByType retrieves a validator by its type
	GetValidatorByType(ctx context.Context, validatorType string) (*entities.Validator, error)
	
	// GetValidatorEvents retrieves events for a specific validator
	GetValidatorEvents(ctx context.Context, validatorType string) ([]entities.Event, error)
	
	// GetValidatorEventsByType retrieves events of a specific type for a validator
	GetValidatorEventsByType(ctx context.Context, validatorType, eventType string) ([]entities.Event, error)
	
	// GetValidatorEventsByBlockRange retrieves events within a block range for a validator
	GetValidatorEventsByBlockRange(ctx context.Context, validatorType string, startBlock, endBlock int) ([]entities.Event, error)
	
	// GetValidatorStats retrieves statistics for a validator
	GetValidatorStats(ctx context.Context, validatorType string) (*ValidatorStats, error)
}

// ValidatorStats represents statistics for a validator
type ValidatorStats struct {
	TotalEvents     int   `json:"total_events"`
	StakingEvents   int   `json:"staking_events"`
	GovernanceEvents int  `json:"governance_events"`
	OnlineEvents    int   `json:"online_events"`
	OffenceEvents   int   `json:"offence_events"`
	TotalRewards    int64 `json:"total_rewards"`
	IsActive        bool  `json:"is_active"`
	HasBeenSlashed  bool  `json:"has_been_slashed"`
} 