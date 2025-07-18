package entities

import (
	"time"
)

// Event represents a blockchain event
type Event struct {
	Block     int         `json:"block"`
	Event     string      `json:"event"`
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
	Hash      string      `json:"hash,omitempty"`
}

// NewEvent creates a new event instance
func NewEvent(block int, eventType string, data interface{}) *Event {
	return &Event{
		Block:     block,
		Event:     eventType,
		Data:      data,
		Timestamp: time.Now(),
	}
}

// NewEventWithHash creates a new event instance with hash
func NewEventWithHash(block int, eventType string, data interface{}, hash string) *Event {
	return &Event{
		Block:     block,
		Event:     eventType,
		Data:      data,
		Timestamp: time.Now(),
		Hash:      hash,
	}
}

// IsStakingEvent returns true if the event is a staking-related event
func (e *Event) IsStakingEvent() bool {
	return e.Event == "staking.Bonded" ||
		e.Event == "staking.ValidatorPrefsSet" ||
		e.Event == "staking.StakersElected" ||
		e.Event == "staking.PayoutStarted" ||
		e.Event == "staking.Rewarded" ||
		e.Event == "staking.EraPaid" ||
		e.Event == "staking.Slashed" ||
		e.Event == "staking.SlashReported" ||
		e.Event == "staking.Chilled"
}

// IsGovernanceEvent returns true if the event is a governance-related event
func (e *Event) IsGovernanceEvent() bool {
	return e.Event == "democracy.Voted" ||
		e.Event == "democracy.NotPassed" ||
		e.Event == "referenda.Confirmed"
}

// IsOnlineEvent returns true if the event is an online/offline-related event
func (e *Event) IsOnlineEvent() bool {
	return e.Event == "imOnline.HeartbeatReceived" ||
		e.Event == "imOnline.AllGood" ||
		e.Event == "imOnline.SomeOffline" ||
		e.Event == "session.ValidatorDisabled"
}

// IsOffenceEvent returns true if the event is an offence-related event
func (e *Event) IsOffenceEvent() bool {
	return e.Event == "offences.Offence"
}

// GetEventCategory returns the category of the event
func (e *Event) GetEventCategory() string {
	switch {
	case e.IsStakingEvent():
		return "staking"
	case e.IsGovernanceEvent():
		return "governance"
	case e.IsOnlineEvent():
		return "online"
	case e.IsOffenceEvent():
		return "offence"
	default:
		return "other"
	}
}

// GetAmount returns the amount from the event data if available
func (e *Event) GetAmount() (int64, bool) {
	if data, ok := e.Data.(map[string]interface{}); ok {
		if amount, ok := data["amount"].(int64); ok {
			return amount, true
		}
	}
	return 0, false
}

// GetStash returns the stash address from the event data if available
func (e *Event) GetStash() (string, bool) {
	if data, ok := e.Data.(map[string]interface{}); ok {
		if stash, ok := data["stash"].(string); ok {
			return stash, true
		}
	}
	return "", false
} 