package usecases

import (
	"context"
	"data-server/internal/domain/entities"
	"data-server/internal/ports/input"
	"data-server/internal/ports/output"
)

type EventUseCase struct {
	validatorRepo output.ValidatorRepository
}

func NewEventUseCase(validatorRepo output.ValidatorRepository) *EventUseCase {
	return &EventUseCase{validatorRepo: validatorRepo}
}

func (uc *EventUseCase) GetAllEvents(ctx context.Context) ([]entities.Event, error) {
	validators, err := uc.validatorRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	var events []entities.Event
	for _, v := range validators {
		events = append(events, v.Events...)
	}
	return events, nil
}

func (uc *EventUseCase) GetEventsByType(ctx context.Context, eventType string) ([]entities.Event, error) {
	all, err := uc.GetAllEvents(ctx)
	if err != nil {
		return nil, err
	}
	var filtered []entities.Event
	for _, e := range all {
		if e.Event == eventType {
			filtered = append(filtered, e)
		}
	}
	return filtered, nil
}

func (uc *EventUseCase) GetEventsByBlockRange(ctx context.Context, startBlock, endBlock int) ([]entities.Event, error) {
	all, err := uc.GetAllEvents(ctx)
	if err != nil {
		return nil, err
	}
	var filtered []entities.Event
	for _, e := range all {
		if e.Block >= startBlock && e.Block <= endBlock {
			filtered = append(filtered, e)
		}
	}
	return filtered, nil
}

func (uc *EventUseCase) GetEventsByCategory(ctx context.Context, category string) ([]entities.Event, error) {
	all, err := uc.GetAllEvents(ctx)
	if err != nil {
		return nil, err
	}
	var filtered []entities.Event
	for _, e := range all {
		if e.GetEventCategory() == category {
			filtered = append(filtered, e)
		}
	}
	return filtered, nil
}

func (uc *EventUseCase) GetEventsByValidator(ctx context.Context, stash string) ([]entities.Event, error) {
	validators, err := uc.validatorRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	for _, v := range validators {
		if v.Stash == stash {
			return v.Events, nil
		}
	}
	return nil, nil
}

func (uc *EventUseCase) GetEventStats(ctx context.Context) (*input.EventStats, error) {
	all, err := uc.GetAllEvents(ctx)
	if err != nil {
		return nil, err
	}
	stats := &input.EventStats{
		EventsByType:     map[string]int{},
		EventsByCategory: map[string]int{},
		EventsByBlock:    map[int]int{},
		UniqueValidators: []string{},
	}
	validatorSet := map[string]struct{}{}
	for _, e := range all {
		stats.TotalEvents++
		stats.EventsByType[e.Event]++
		cat := e.GetEventCategory()
		stats.EventsByCategory[cat]++
		stats.EventsByBlock[e.Block]++
		if amount, ok := e.GetAmount(); ok {
			stats.TotalAmount += amount
		}
		if stash, ok := e.GetStash(); ok {
			validatorSet[stash] = struct{}{}
		}
	}
	for v := range validatorSet {
		stats.UniqueValidators = append(stats.UniqueValidators, v)
	}
	return stats, nil
}
