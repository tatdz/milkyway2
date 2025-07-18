package memory

import (
	"context"
	"errors"
	"sync"

	"data-server/internal/domain/entities"
)

// ValidatorRepository implements the validator repository interface using in-memory storage
type ValidatorRepository struct {
	validators map[string]*entities.Validator
	mutex      sync.RWMutex
}

// NewValidatorRepository creates a new in-memory validator repository
func NewValidatorRepository() *ValidatorRepository {
	repo := &ValidatorRepository{
		validators: make(map[string]*entities.Validator),
	}

	// Initialize with sample data
	repo.initializeSampleData()

	return repo
}

// GetAll retrieves all validators
func (r *ValidatorRepository) GetAll(ctx context.Context) ([]*entities.Validator, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var validators []*entities.Validator
	for _, validator := range r.validators {
		validators = append(validators, validator)
	}

	return validators, nil
}

// GetByType retrieves a validator by its type
func (r *ValidatorRepository) GetByType(ctx context.Context, validatorType string) (*entities.Validator, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	validator, exists := r.validators[validatorType]
	if !exists {
		return nil, errors.New("validator not found")
	}

	return validator, nil
}

// GetByStash retrieves a validator by its stash address
func (r *ValidatorRepository) GetByStash(ctx context.Context, stash string) (*entities.Validator, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	for _, validator := range r.validators {
		if validator.Stash == stash {
			return validator, nil
		}
	}

	return nil, errors.New("validator not found")
}

// Save saves a validator
func (r *ValidatorRepository) Save(ctx context.Context, validator *entities.Validator) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	r.validators[string(validator.Type)] = validator
	return nil
}

// Update updates a validator
func (r *ValidatorRepository) Update(ctx context.Context, validator *entities.Validator) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.validators[string(validator.Type)]; !exists {
		return errors.New("validator not found")
	}

	r.validators[string(validator.Type)] = validator
	return nil
}

// initializeSampleData initializes the repository with sample validator data
func (r *ValidatorRepository) initializeSampleData() {
	// Good validator - Active, reliable, participates in governance
	goodValidator := entities.NewValidator(
		"5F3sa2TJc...Good",
		entities.ValidatorTypeGood,
		"Active every session, regular voter and delegate, always online, no slashes, earns consistent rewards, participates in governance",
	)

	goodEvents := []entities.Event{
		// Staking events - successful bonding and rewards (block 112000+)
		*entities.NewEvent(112034, "staking.Bonded", map[string]interface{}{"stash": "5F3sa2TJc...Good", "amount": 500000000000}),
		*entities.NewEvent(112035, "staking.ValidatorPrefsSet", map[string]interface{}{"stash": "5F3sa2TJc...Good", "prefs": map[string]interface{}{"commission": 0}}),
		*entities.NewEvent(112040, "staking.StakersElected", map[string]interface{}{}),
		*entities.NewEvent(112041, "staking.OldSlashingReportDiscarded", map[string]interface{}{"session_index": 229}),

		// Session and online status - always active
		*entities.NewEvent(112048, "session.NewSession", map[string]interface{}{"session_index": 230}),
		*entities.NewEvent(112049, "imOnline.HeartbeatReceived", map[string]interface{}{"authority_id": "5F3sa2TJc...Good"}),
		*entities.NewEvent(112050, "imOnline.AllGood", map[string]interface{}{}),
		*entities.NewEvent(112051, "session.NewSession", map[string]interface{}{"session_index": 231}),
		*entities.NewEvent(112052, "imOnline.HeartbeatReceived", map[string]interface{}{"authority_id": "5F3sa2TJc...Good"}),
		*entities.NewEvent(112053, "imOnline.AllGood", map[string]interface{}{}),

		// Rewards and payouts - consistent earnings with realistic variation
		*entities.NewEvent(112072, "staking.PayoutStarted", map[string]interface{}{"era_index": 1004, "validator_stash": "5F3sa2TJc...Good", "page": 0, "next": nil}),
		*entities.NewEvent(112073, "staking.Rewarded", map[string]interface{}{"stash": "5F3sa2TJc...Good", "dest": "Stash", "amount": 14783456789}),
		*entities.NewEvent(112074, "staking.EraPaid", map[string]interface{}{"era_index": 1004, "validator_payout": 14783456789, "remainder": 201654321}),
		*entities.NewEvent(112075, "staking.PayoutStarted", map[string]interface{}{"era_index": 1005, "validator_stash": "5F3sa2TJc...Good", "page": 0, "next": nil}),
		*entities.NewEvent(112076, "staking.Rewarded", map[string]interface{}{"stash": "5F3sa2TJc...Good", "dest": "Stash", "amount": 15219876543}),
		*entities.NewEvent(112077, "staking.EraPaid", map[string]interface{}{"era_index": 1005, "validator_payout": 15219876543, "remainder": 180123457}),
		*entities.NewEvent(112078, "staking.PayoutStarted", map[string]interface{}{"era_index": 1006, "validator_stash": "5F3sa2TJc...Good", "page": 0, "next": nil}),
		*entities.NewEvent(112079, "staking.Rewarded", map[string]interface{}{"stash": "5F3sa2TJc...Good", "dest": "Stash", "amount": 14987654321}),
		*entities.NewEvent(112080, "staking.EraPaid", map[string]interface{}{"era_index": 1006, "validator_payout": 14987654321, "remainder": 123456789}),

		// Democracy participation - active voter with realistic timing
		*entities.NewEvent(112090, "democracy.Proposed", map[string]interface{}{"proposal_index": 45, "deposit": 50000000000}),
		*entities.NewEvent(112091, "democracy.Seconded", map[string]interface{}{"seconder": "5F3sa2TJc...Good", "proposal_index": 45}),
		*entities.NewEvent(112092, "democracy.Seconded", map[string]interface{}{"seconder": "5F3sa2TJc...Good", "proposal_index": 46}),
		*entities.NewEvent(112093, "democracy.Proposed", map[string]interface{}{"proposal_index": 46, "deposit": 75000000000}),
		*entities.NewEvent(112094, "democracy.Started", map[string]interface{}{"referendum_index": 22, "threshold": "SuperMajorityApprove"}),
		*entities.NewEvent(112095, "democracy.Voted", map[string]interface{}{"voter": "5F3sa2TJc...Good", "ref_index": 22, "vote": map[string]interface{}{"Standard": map[string]interface{}{"vote": "aye", "balance": 100000000000}}}),
		*entities.NewEvent(112096, "democracy.Passed", map[string]interface{}{"ref_index": 22}),
		*entities.NewEvent(112097, "democracy.Started", map[string]interface{}{"referendum_index": 23, "threshold": "SimpleMajority"}),
		*entities.NewEvent(112098, "democracy.Voted", map[string]interface{}{"voter": "5F3sa2TJc...Good", "ref_index": 23, "vote": map[string]interface{}{"Standard": map[string]interface{}{"vote": "nay", "balance": 100000000000}}}),
		*entities.NewEvent(112099, "democracy.NotPassed", map[string]interface{}{"ref_index": 23}),

		// Referenda participation with realistic timing
		*entities.NewEvent(112120, "referenda.Submitted", map[string]interface{}{"referendum_index": 25, "proposal_hash": "0x1234567890abcdef"}),
		*entities.NewEvent(112121, "referenda.DecisionDepositPlaced", map[string]interface{}{"referendum_index": 25, "who": "5F3sa2TJc...Good", "amount": 100000000000}),
		*entities.NewEvent(112122, "referenda.DecisionStarted", map[string]interface{}{"referendum_index": 25, "track": 0, "conviction": "Locked1x"}),
		*entities.NewEvent(112123, "referenda.Confirmed", map[string]interface{}{"referendum_index": 22}),
		*entities.NewEvent(112124, "referenda.Confirmed", map[string]interface{}{"referendum_index": 25}),

		// System events - successful operations
		*entities.NewEvent(112130, "system.ExtrinsicSuccess", map[string]interface{}{"dispatch_info": map[string]interface{}{"weight": 1000000, "class": "Normal", "pays_fee": true}}),
		*entities.NewEvent(112131, "system.NewAccount", map[string]interface{}{"account": "5F3sa2TJc...Good"}),
		*entities.NewEvent(112132, "system.Remarked", map[string]interface{}{"sender": "5F3sa2TJc...Good", "hash": "0xabcdef1234567890"}),

		// Babe events - consensus participation
		*entities.NewEvent(112140, "babe.EpochStarted", map[string]interface{}{"epoch_index": 1150}),
		*entities.NewEvent(112141, "babe.EpochFinalized", map[string]interface{}{"epoch_index": 1149}),
		*entities.NewEvent(112142, "babe.AuthoritiesChanged", map[string]interface{}{}),
	}

	for _, event := range goodEvents {
		goodValidator.AddEvent(event)
	}

	// Neutral validator - Inconsistent participation, minimal governance involvement (block 113000+)
	neutralValidator := entities.NewValidator(
		"5DAAnrj7V...Neutral",
		entities.ValidatorTypeNeutral,
		"Mostly consistent session participation, rarely participates in governance, not optimal but no slashing, occasional offline periods",
	)

	neutralEvents := []entities.Event{
		// Staking events - moderate bonding
		*entities.NewEvent(113012, "staking.Bonded", map[string]interface{}{"stash": "5DAAnrj7V...Neutral", "amount": 400000000000}),
		*entities.NewEvent(113013, "staking.ValidatorPrefsSet", map[string]interface{}{"stash": "5DAAnrj7V...Neutral", "prefs": map[string]interface{}{"commission": 5000000}}),
		*entities.NewEvent(113014, "staking.StakersElected", map[string]interface{}{}),

		// Session and online status - inconsistent participation
		*entities.NewEvent(113020, "session.NewSession", map[string]interface{}{"session_index": 225}),
		*entities.NewEvent(113021, "imOnline.HeartbeatReceived", map[string]interface{}{"authority_id": "5DAAnrj7V...Neutral"}),
		*entities.NewEvent(113022, "imOnline.AllGood", map[string]interface{}{}),
		*entities.NewEvent(113023, "session.NewSession", map[string]interface{}{"session_index": 226}),
		*entities.NewEvent(113024, "imOnline.SomeOffline", map[string]interface{}{"authority_ids": []string{"5DAAnrj7V...Neutral"}}),
		*entities.NewEvent(113025, "session.NewSession", map[string]interface{}{"session_index": 227}),
		*entities.NewEvent(113026, "imOnline.HeartbeatReceived", map[string]interface{}{"authority_id": "5DAAnrj7V...Neutral"}),
		*entities.NewEvent(113027, "imOnline.AllGood", map[string]interface{}{}),

		// Rewards and payouts - lower earnings due to inconsistency with realistic variation
		*entities.NewEvent(113050, "staking.PayoutStarted", map[string]interface{}{"era_index": 999, "validator_stash": "5DAAnrj7V...Neutral", "page": 0, "next": nil}),
		*entities.NewEvent(113051, "staking.Rewarded", map[string]interface{}{"stash": "5DAAnrj7V...Neutral", "dest": "Stash", "amount": 6723456789}),
		*entities.NewEvent(113052, "staking.EraPaid", map[string]interface{}{"era_index": 999, "validator_payout": 6723456789, "remainder": 127654321}),
		*entities.NewEvent(113053, "staking.PayoutStarted", map[string]interface{}{"era_index": 1000, "validator_stash": "5DAAnrj7V...Neutral", "page": 0, "next": nil}),
		*entities.NewEvent(113054, "staking.Rewarded", map[string]interface{}{"stash": "5DAAnrj7V...Neutral", "dest": "Stash", "amount": 5845678901}),
		*entities.NewEvent(113055, "staking.EraPaid", map[string]interface{}{"era_index": 1000, "validator_payout": 5845678901, "remainder": 154321099}),
		*entities.NewEvent(113056, "staking.PayoutStarted", map[string]interface{}{"era_index": 1001, "validator_stash": "5DAAnrj7V...Neutral", "page": 0, "next": nil}),
		*entities.NewEvent(113057, "staking.Rewarded", map[string]interface{}{"stash": "5DAAnrj7V...Neutral", "dest": "Stash", "amount": 5987654321}),
		*entities.NewEvent(113058, "staking.EraPaid", map[string]interface{}{"era_index": 1001, "validator_payout": 5987654321, "remainder": 123456789}),

		// Democracy participation - minimal involvement
		*entities.NewEvent(113090, "democracy.NotPassed", map[string]interface{}{"referendum_index": 20}),
		*entities.NewEvent(113091, "democracy.Cancelled", map[string]interface{}{"ref_index": 21}),
		*entities.NewEvent(113092, "democracy.Voted", map[string]interface{}{"voter": "5DAAnrj7V...Neutral", "ref_index": 25, "vote": map[string]interface{}{"Standard": map[string]interface{}{"vote": "aye", "balance": 400000000000}}}),
		*entities.NewEvent(113093, "democracy.Started", map[string]interface{}{"referendum_index": 26, "threshold": "SimpleMajority"}),
		*entities.NewEvent(113094, "democracy.Tabled", map[string]interface{}{"proposal_index": 47}),

		// Referenda - minimal participation
		*entities.NewEvent(113130, "referenda.Rejected", map[string]interface{}{"referendum_index": 20}),
		*entities.NewEvent(113131, "referenda.TimedOut", map[string]interface{}{"referendum_index": 21}),
		*entities.NewEvent(113132, "referenda.Killed", map[string]interface{}{"referendum_index": 22}),

		// System events - some failures
		*entities.NewEvent(113140, "system.ExtrinsicSuccess", map[string]interface{}{"dispatch_info": map[string]interface{}{"weight": 800000, "class": "Normal", "pays_fee": true}}),
		*entities.NewEvent(113141, "system.ExtrinsicFailed", map[string]interface{}{"dispatch_error": map[string]interface{}{"module": "System", "error": "BadOrigin"}, "dispatch_info": map[string]interface{}{"weight": 500000, "class": "Normal", "pays_fee": true}}),
		*entities.NewEvent(113142, "system.ExtrinsicSuccess", map[string]interface{}{"dispatch_info": map[string]interface{}{"weight": 600000, "class": "Normal", "pays_fee": true}}),

		// Babe events - occasional participation
		*entities.NewEvent(113150, "babe.EpochStarted", map[string]interface{}{"epoch_index": 1125}),
		*entities.NewEvent(113151, "babe.EpochFinalized", map[string]interface{}{"epoch_index": 1124}),
	}

	for _, event := range neutralEvents {
		neutralValidator.AddEvent(event)
	}

	// Bad validator - Poor performance, slashing, eventual removal (block 114000+)
	badValidator := entities.NewValidator(
		"5HGjWAeFD...Bad",
		entities.ValidatorTypeBad,
		"Irregular session participation, never votes, slashed, disabled, eventually chilled and removed from the network",
	)

	badEvents := []entities.Event{
		// Staking events - initial bonding then problems
		*entities.NewEvent(114000, "staking.Bonded", map[string]interface{}{"stash": "5HGjWAeFD...Bad", "amount": 300000000000}),
		*entities.NewEvent(114001, "staking.ValidatorPrefsSet", map[string]interface{}{"stash": "5HGjWAeFD...Bad", "prefs": map[string]interface{}{"commission": 10000000}}),
		*entities.NewEvent(114002, "staking.StakersElected", map[string]interface{}{}),

		// Session and online status - frequent offline periods
		*entities.NewEvent(114005, "session.NewSession", map[string]interface{}{"session_index": 220}),
		*entities.NewEvent(114006, "imOnline.SomeOffline", map[string]interface{}{"authority_ids": []string{"5HGjWAeFD...Bad"}}),
		*entities.NewEvent(114007, "session.NewSession", map[string]interface{}{"session_index": 221}),
		*entities.NewEvent(114008, "imOnline.SomeOffline", map[string]interface{}{"authority_ids": []string{"5HGjWAeFD...Bad"}}),
		*entities.NewEvent(114009, "session.NewSession", map[string]interface{}{"session_index": 222}),
		*entities.NewEvent(114010, "imOnline.SomeOffline", map[string]interface{}{"authority_ids": []string{"5HGjWAeFD...Bad"}}),

		// Offences and slashing - serious violations with detailed structure
		*entities.NewEvent(114011, "offences.Offence", map[string]interface{}{"offender": []map[string]interface{}{{"who": "5HGjWAeFD...Bad", "offence": "offline"}}, "kind": "offline"}),
		*entities.NewEvent(114012, "offences.Offence", map[string]interface{}{"offender": []map[string]interface{}{{"who": "5HGjWAeFD...Bad", "offence": "equivocation"}}, "kind": "equivocation"}),
		*entities.NewEvent(114013, "offences.Offence", map[string]interface{}{"offender": []map[string]interface{}{{"who": "5HGjWAeFD...Bad", "offence": "grandpa"}}, "kind": "grandpa"}),
		*entities.NewEvent(114015, "staking.Slashed", map[string]interface{}{"staker": "5HGjWAeFD...Bad", "amount": 12000000000}),
		*entities.NewEvent(114016, "staking.SlashReported", map[string]interface{}{"validator": "5HGjWAeFD...Bad", "fraction": "Perbill(100000000)", "slash_era": 996}),
		*entities.NewEvent(114017, "staking.SlashReported", map[string]interface{}{"validator": "5HGjWAeFD...Bad", "fraction": "Perbill(50000000)", "slash_era": 997}),
		*entities.NewEvent(114018, "staking.SlashReported", map[string]interface{}{"validator": "5HGjWAeFD...Bad", "fraction": "Perbill(25000000)", "slash_era": 998}),

		// Disabling and chilling
		*entities.NewEvent(114018, "session.ValidatorDisabled", map[string]interface{}{"who": "5HGjWAeFD...Bad"}),
		*entities.NewEvent(114019, "session.NewSession", map[string]interface{}{"session_index": 223}),
		*entities.NewEvent(114020, "session.ValidatorDisabled", map[string]interface{}{"who": "5HGjWAeFD...Bad"}),
		*entities.NewEvent(114021, "session.NewSession", map[string]interface{}{"session_index": 224}),
		*entities.NewEvent(114022, "session.ValidatorDisabled", map[string]interface{}{"who": "5HGjWAeFD...Bad"}),

		// Final chilling and removal
		*entities.NewEvent(114050, "staking.Chilled", map[string]interface{}{"stash": "5HGjWAeFD...Bad"}),
		*entities.NewEvent(114051, "staking.Kicked", map[string]interface{}{"nominator": "5HGjWAeFD...Bad", "stash": "5HGjWAeFD...Bad"}),
		*entities.NewEvent(114052, "staking.Unbonded", map[string]interface{}{"stash": "5HGjWAeFD...Bad", "amount": 300000000000}),
		*entities.NewEvent(114053, "staking.Withdrawn", map[string]interface{}{"stash": "5HGjWAeFD...Bad", "amount": 300000000000}),
		*entities.NewEvent(114054, "staking.OldSlashingReportDiscarded", map[string]interface{}{"session_index": 225}),

		// Democracy - no participation
		*entities.NewEvent(114060, "democracy.NotPassed", map[string]interface{}{"referendum_index": 18}),
		*entities.NewEvent(114061, "democracy.Cancelled", map[string]interface{}{"ref_index": 19}),
		*entities.NewEvent(114062, "democracy.ExternalTabled", map[string]interface{}{}),

		// Referenda - no participation
		*entities.NewEvent(114070, "referenda.Rejected", map[string]interface{}{"referendum_index": 18}),
		*entities.NewEvent(114071, "referenda.Killed", map[string]interface{}{"referendum_index": 19}),
		*entities.NewEvent(114072, "referenda.Cancelled", map[string]interface{}{"referendum_index": 20}),

		// System events - account removal
		*entities.NewEvent(114070, "system.KilledAccount", map[string]interface{}{"account": "5HGjWAeFD...Bad"}),
		*entities.NewEvent(114071, "system.ExtrinsicFailed", map[string]interface{}{"dispatch_error": map[string]interface{}{"module": "Staking", "error": "NotController"}, "dispatch_info": map[string]interface{}{"weight": 300000, "class": "Normal", "pays_fee": true}}),
		*entities.NewEvent(114072, "system.ExtrinsicFailed", map[string]interface{}{"dispatch_error": map[string]interface{}{"module": "System", "error": "InsufficientFunds"}, "dispatch_info": map[string]interface{}{"weight": 200000, "class": "Normal", "pays_fee": true}}),

		// Babe events - no consensus participation
		*entities.NewEvent(114080, "babe.EpochStarted", map[string]interface{}{"epoch_index": 1100}),
		*entities.NewEvent(114081, "babe.EpochFinalized", map[string]interface{}{"epoch_index": 1099}),
	}

	for _, event := range badEvents {
		badValidator.AddEvent(event)
	}

	r.validators["good"] = goodValidator
	r.validators["neutral"] = neutralValidator
	r.validators["bad"] = badValidator
}
