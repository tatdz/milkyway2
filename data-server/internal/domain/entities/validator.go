package entities

import (
	"time"
)

// ValidatorType represents the type of validator
type ValidatorType string

const (
	ValidatorTypeGood    ValidatorType = "good"
	ValidatorTypeNeutral ValidatorType = "neutral"
	ValidatorTypeBad     ValidatorType = "bad"
)

// Validator represents a blockchain validator
type Validator struct {
	Stash       string        `json:"stash"`
	Type        ValidatorType `json:"type"`
	Description string        `json:"description"`
	Events      []Event       `json:"events"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

// NewValidator creates a new validator instance
func NewValidator(stash string, validatorType ValidatorType, description string) *Validator {
	now := time.Now()
	return &Validator{
		Stash:       stash,
		Type:        validatorType,
		Description: description,
		Events:      []Event{},
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// AddEvent adds an event to the validator
func (v *Validator) AddEvent(event Event) {
	v.Events = append(v.Events, event)
	v.UpdatedAt = time.Now()
}

// GetEventsByType returns events filtered by event type
func (v *Validator) GetEventsByType(eventType string) []Event {
	var filteredEvents []Event
	for _, event := range v.Events {
		if event.Event == eventType {
			filteredEvents = append(filteredEvents, event)
		}
	}
	return filteredEvents
}

// GetEventsByBlockRange returns events within a block range
func (v *Validator) GetEventsByBlockRange(startBlock, endBlock int) []Event {
	var filteredEvents []Event
	for _, event := range v.Events {
		if event.Block >= startBlock && event.Block <= endBlock {
			filteredEvents = append(filteredEvents, event)
		}
	}
	return filteredEvents
}

// IsActive returns true if the validator is currently active
func (v *Validator) IsActive() bool {
	// Check if the validator has recent heartbeat events
	for _, event := range v.Events {
		if event.Event == "imOnline.HeartbeatReceived" {
			return true
		}
	}
	return false
}

// HasBeenSlashed returns true if the validator has been slashed
func (v *Validator) HasBeenSlashed() bool {
	for _, event := range v.Events {
		if event.Event == "staking.Slashed" {
			return true
		}
	}
	return false
}

// GetTotalRewards returns the total rewards earned by the validator
func (v *Validator) GetTotalRewards() int64 {
	var totalRewards int64
	for _, event := range v.Events {
		if event.Event == "staking.Rewarded" {
			if data, ok := event.Data.(map[string]interface{}); ok {
				if amount, ok := data["amount"].(int64); ok {
					totalRewards += amount
				}
			}
		}
	}
	return totalRewards
} 