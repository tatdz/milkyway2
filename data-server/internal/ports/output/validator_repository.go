package output

import (
	"context"

	"data-server/internal/domain/entities"
)

// ValidatorRepository defines the interface for validator data access
type ValidatorRepository interface {
	// GetAll retrieves all validators
	GetAll(ctx context.Context) ([]*entities.Validator, error)
	
	// GetByType retrieves a validator by its type
	GetByType(ctx context.Context, validatorType string) (*entities.Validator, error)
	
	// GetByStash retrieves a validator by its stash address
	GetByStash(ctx context.Context, stash string) (*entities.Validator, error)
	
	// Save saves a validator
	Save(ctx context.Context, validator *entities.Validator) error
	
	// Update updates a validator
	Update(ctx context.Context, validator *entities.Validator) error
} 