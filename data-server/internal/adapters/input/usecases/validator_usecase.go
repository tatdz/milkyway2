package usecases

import (
	"context"

	"data-server/internal/domain/entities"
	"data-server/internal/ports/input"
	"data-server/internal/ports/output"
)

// ValidatorUseCase implements the ValidatorService interface
type ValidatorUseCase struct {
	validatorRepo output.ValidatorRepository
}

// NewValidatorUseCase creates a new validator use case
func NewValidatorUseCase(validatorRepo output.ValidatorRepository) *ValidatorUseCase {
	return &ValidatorUseCase{
		validatorRepo: validatorRepo,
	}
}

// GetAllValidators retrieves all validators
func (uc *ValidatorUseCase) GetAllValidators(ctx context.Context) ([]*entities.Validator, error) {
	return uc.validatorRepo.GetAll(ctx)
}

// GetValidatorByType retrieves a validator by its type
func (uc *ValidatorUseCase) GetValidatorByType(ctx context.Context, validatorType string) (*entities.Validator, error) {
	return uc.validatorRepo.GetByType(ctx, validatorType)
}

// GetValidatorEvents retrieves events for a specific validator
func (uc *ValidatorUseCase) GetValidatorEvents(ctx context.Context, validatorType string) ([]entities.Event, error) {
	validator, err := uc.validatorRepo.GetByType(ctx, validatorType)
	if err != nil {
		return nil, err
	}
	
	return validator.Events, nil
}

// GetValidatorEventsByType retrieves events of a specific type for a validator
func (uc *ValidatorUseCase) GetValidatorEventsByType(ctx context.Context, validatorType, eventType string) ([]entities.Event, error) {
	validator, err := uc.validatorRepo.GetByType(ctx, validatorType)
	if err != nil {
		return nil, err
	}
	
	return validator.GetEventsByType(eventType), nil
}

// GetValidatorEventsByBlockRange retrieves events within a block range for a validator
func (uc *ValidatorUseCase) GetValidatorEventsByBlockRange(ctx context.Context, validatorType string, startBlock, endBlock int) ([]entities.Event, error) {
	validator, err := uc.validatorRepo.GetByType(ctx, validatorType)
	if err != nil {
		return nil, err
	}
	
	return validator.GetEventsByBlockRange(startBlock, endBlock), nil
}

// GetValidatorStats retrieves statistics for a validator
func (uc *ValidatorUseCase) GetValidatorStats(ctx context.Context, validatorType string) (*input.ValidatorStats, error) {
	validator, err := uc.validatorRepo.GetByType(ctx, validatorType)
	if err != nil {
		return nil, err
	}
	
	stats := &input.ValidatorStats{
		TotalEvents:     len(validator.Events),
		StakingEvents:   0,
		GovernanceEvents: 0,
		OnlineEvents:    0,
		OffenceEvents:   0,
		TotalRewards:    validator.GetTotalRewards(),
		IsActive:        validator.IsActive(),
		HasBeenSlashed:  validator.HasBeenSlashed(),
	}
	
	// Count events by category
	for _, event := range validator.Events {
		switch event.GetEventCategory() {
		case "staking":
			stats.StakingEvents++
		case "governance":
			stats.GovernanceEvents++
		case "online":
			stats.OnlineEvents++
		case "offence":
			stats.OffenceEvents++
		}
	}
	
	return stats, nil
} 