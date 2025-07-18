import { IncomingMessage, ServerResponse } from 'http';

// Hardcoded example data
const exampleData = {
  "success": true,
  "data": [
    {
      "timestamp": "2025-07-17T19:46:52.923Z",
      "summary": {
        "success": true,
        "data": [
          {
            "block": 113012,
            "event": "staking.Bonded",
            "data": {
              "amount": 400000000000,
              "stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374788864Z"
          },
          {
            "block": 113013,
            "event": "staking.ValidatorPrefsSet",
            "data": {
              "prefs": {
                "commission": 5000000
              },
              "stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374789234Z"
          },
          {
            "block": 113014,
            "event": "staking.StakersElected",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374789344Z"
          },
          {
            "block": 113020,
            "event": "session.NewSession",
            "data": {
              "session_index": 225
            },
            "timestamp": "2025-07-17T00:30:06.374789524Z"
          },
          {
            "block": 113021,
            "event": "imOnline.HeartbeatReceived",
            "data": {
              "authority_id": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374789704Z"
          },
          {
            "block": 113022,
            "event": "imOnline.AllGood",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374789874Z"
          },
          {
            "block": 113023,
            "event": "session.NewSession",
            "data": {
              "session_index": 226
            },
            "timestamp": "2025-07-17T00:30:06.374790054Z"
          },
          {
            "block": 113024,
            "event": "imOnline.SomeOffline",
            "data": {
              "authority_ids": ["5DAAnrj7V...Neutral"]
            },
            "timestamp": "2025-07-17T00:30:06.374790554Z"
          },
          {
            "block": 113025,
            "event": "session.NewSession",
            "data": {
              "session_index": 227
            },
            "timestamp": "2025-07-17T00:30:06.374793094Z"
          },
          {
            "block": 113026,
            "event": "imOnline.HeartbeatReceived",
            "data": {
              "authority_id": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374806964Z"
          },
          {
            "block": 113027,
            "event": "imOnline.AllGood",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374807114Z"
          },
          {
            "block": 113050,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 999,
              "next": null,
              "page": 0,
              "validator_stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374807494Z"
          },
          {
            "block": 113051,
            "event": "staking.Rewarded",
            "data": {
              "amount": 6723456789,
              "dest": "Stash",
              "stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374807804Z"
          },
          {
            "block": 113052,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 999,
              "remainder": 127654321,
              "validator_payout": 6723456789
            },
            "timestamp": "2025-07-17T00:30:06.374808084Z"
          },
          {
            "block": 113053,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 1000,
              "next": null,
              "page": 0,
              "validator_stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374808404Z"
          },
          {
            "block": 113054,
            "event": "staking.Rewarded",
            "data": {
              "amount": 5845678901,
              "dest": "Stash",
              "stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374808684Z"
          },
          {
            "block": 113055,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 1000,
              "remainder": 154321099,
              "validator_payout": 5845678901
            },
            "timestamp": "2025-07-17T00:30:06.374808954Z"
          },
          {
            "block": 113056,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 1001,
              "next": null,
              "page": 0,
              "validator_stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374809304Z"
          },
          {
            "block": 113057,
            "event": "staking.Rewarded",
            "data": {
              "amount": 5987654321,
              "dest": "Stash",
              "stash": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374809554Z"
          },
          {
            "block": 113058,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 1001,
              "remainder": 123456789,
              "validator_payout": 5987654321
            },
            "timestamp": "2025-07-17T00:30:06.374812184Z"
          },
          {
            "block": 113090,
            "event": "democracy.NotPassed",
            "data": {
              "referendum_index": 20
            },
            "timestamp": "2025-07-17T00:30:06.374812404Z"
          },
          {
            "block": 113091,
            "event": "democracy.Cancelled",
            "data": {
              "ref_index": 21
            },
            "timestamp": "2025-07-17T00:30:06.374812594Z"
          },
          {
            "block": 113092,
            "event": "democracy.Voted",
            "data": {
              "ref_index": 25,
              "vote": {
                "Standard": {
                  "balance": 400000000000,
                  "vote": "aye"
                }
              },
              "voter": "5DAAnrj7V...Neutral"
            },
            "timestamp": "2025-07-17T00:30:06.374819694Z"
          },
          {
            "block": 113093,
            "event": "democracy.Started",
            "data": {
              "referendum_index": 26,
              "threshold": "SimpleMajority"
            },
            "timestamp": "2025-07-17T00:30:06.374820014Z"
          },
          {
            "block": 113094,
            "event": "democracy.Tabled",
            "data": {
              "proposal_index": 47
            },
            "timestamp": "2025-07-17T00:30:06.374820204Z"
          },
          {
            "block": 113130,
            "event": "referenda.Rejected",
            "data": {
              "referendum_index": 20
            },
            "timestamp": "2025-07-17T00:30:06.374820384Z"
          },
          {
            "block": 113131,
            "event": "referenda.TimedOut",
            "data": {
              "referendum_index": 21
            },
            "timestamp": "2025-07-17T00:30:06.374820574Z"
          },
          {
            "block": 113132,
            "event": "referenda.Killed",
            "data": {
              "referendum_index": 22
            },
            "timestamp": "2025-07-17T00:30:06.374820764Z"
          },
          {
            "block": 113140,
            "event": "system.ExtrinsicSuccess",
            "data": {
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 800000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374821164Z"
          },
          {
            "block": 113141,
            "event": "system.ExtrinsicFailed",
            "data": {
              "dispatch_error": {
                "error": "BadOrigin",
                "module": "System"
              },
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 500000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374828044Z"
          },
          {
            "block": 113142,
            "event": "system.ExtrinsicSuccess",
            "data": {
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 600000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374828434Z"
          },
          {
            "block": 113150,
            "event": "babe.EpochStarted",
            "data": {
              "epoch_index": 1125
            },
            "timestamp": "2025-07-17T00:30:06.374831004Z"
          },
          {
            "block": 113151,
            "event": "babe.EpochFinalized",
            "data": {
              "epoch_index": 1124
            },
            "timestamp": "2025-07-17T00:30:06.374843984Z"
          },
          {
            "block": 114000,
            "event": "staking.Bonded",
            "data": {
              "amount": 300000000000,
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374847694Z"
          },
          {
            "block": 114001,
            "event": "staking.ValidatorPrefsSet",
            "data": {
              "prefs": {
                "commission": 10000000
              },
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374848014Z"
          },
          {
            "block": 114002,
            "event": "staking.StakersElected",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374848124Z"
          },
          {
            "block": 114005,
            "event": "session.NewSession",
            "data": {
              "session_index": 220
            },
            "timestamp": "2025-07-17T00:30:06.374848354Z"
          },
          {
            "block": 114006,
            "event": "imOnline.SomeOffline",
            "data": {
              "authority_ids": ["5HGjWAeFD...Bad"]
            },
            "timestamp": "2025-07-17T00:30:06.374848874Z"
          },
          {
            "block": 114007,
            "event": "session.NewSession",
            "data": {
              "session_index": 221
            },
            "timestamp": "2025-07-17T00:30:06.374849084Z"
          },
          {
            "block": 114008,
            "event": "imOnline.SomeOffline",
            "data": {
              "authority_ids": ["5HGjWAeFD...Bad"]
            },
            "timestamp": "2025-07-17T00:30:06.374849414Z"
          },
          {
            "block": 114009,
            "event": "session.NewSession",
            "data": {
              "session_index": 222
            },
            "timestamp": "2025-07-17T00:30:06.374852304Z"
          },
          {
            "block": 114010,
            "event": "imOnline.SomeOffline",
            "data": {
              "authority_ids": ["5HGjWAeFD...Bad"]
            },
            "timestamp": "2025-07-17T00:30:06.374852584Z"
          },
          {
            "block": 114011,
            "event": "offences.Offence",
            "data": {
              "kind": "offline",
              "offender": [
                {
                  "offence": "offline",
                  "who": "5HGjWAeFD...Bad"
                }
              ]
            },
            "timestamp": "2025-07-17T00:30:06.374853164Z"
          },
          {
            "block": 114012,
            "event": "offences.Offence",
            "data": {
              "kind": "equivocation",
              "offender": [
                {
                  "offence": "equivocation",
                  "who": "5HGjWAeFD...Bad"
                }
              ]
            },
            "timestamp": "2025-07-17T00:30:06.374853644Z"
          },
          {
            "block": 114013,
            "event": "offences.Offence",
            "data": {
              "kind": "grandpa",
              "offender": [
                {
                  "offence": "grandpa",
                  "who": "5HGjWAeFD...Bad"
                }
              ]
            },
            "timestamp": "2025-07-17T00:30:06.374860704Z"
          },
          {
            "block": 114015,
            "event": "staking.Slashed",
            "data": {
              "amount": 12000000000,
              "staker": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374860944Z"
          },
          {
            "block": 114016,
            "event": "staking.SlashReported",
            "data": {
              "fraction": "Perbill(100000000)",
              "slash_era": 996,
              "validator": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374861254Z"
          },
          {
            "block": 114017,
            "event": "staking.SlashReported",
            "data": {
              "fraction": "Perbill(50000000)",
              "slash_era": 997,
              "validator": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374861534Z"
          },
          {
            "block": 114018,
            "event": "staking.SlashReported",
            "data": {
              "fraction": "Perbill(25000000)",
              "slash_era": 998,
              "validator": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374861814Z"
          },
          {
            "block": 114018,
            "event": "session.ValidatorDisabled",
            "data": {
              "who": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374861994Z"
          },
          {
            "block": 114019,
            "event": "session.NewSession",
            "data": {
              "session_index": 223
            },
            "timestamp": "2025-07-17T00:30:06.374862194Z"
          },
          {
            "block": 114020,
            "event": "session.ValidatorDisabled",
            "data": {
              "who": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374864744Z"
          },
          {
            "block": 114021,
            "event": "session.NewSession",
            "data": {
              "session_index": 224
            },
            "timestamp": "2025-07-17T00:30:06.374864924Z"
          },
          {
            "block": 114022,
            "event": "session.ValidatorDisabled",
            "data": {
              "who": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374865114Z"
          },
          {
            "block": 114050,
            "event": "staking.Chilled",
            "data": {
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374865294Z"
          },
          {
            "block": 114051,
            "event": "staking.Kicked",
            "data": {
              "nominator": "5HGjWAeFD...Bad",
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374865514Z"
          },
          {
            "block": 114052,
            "event": "staking.Unbonded",
            "data": {
              "amount": 300000000000,
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374865744Z"
          },
          {
            "block": 114053,
            "event": "staking.Withdrawn",
            "data": {
              "amount": 300000000000,
              "stash": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374873754Z"
          },
          {
            "block": 114054,
            "event": "staking.OldSlashingReportDiscarded",
            "data": {
              "session_index": 225
            },
            "timestamp": "2025-07-17T00:30:06.374873974Z"
          },
          {
            "block": 114060,
            "event": "democracy.NotPassed",
            "data": {
              "referendum_index": 18
            },
            "timestamp": "2025-07-17T00:30:06.374874164Z"
          },
          {
            "block": 114061,
            "event": "democracy.Cancelled",
            "data": {
              "ref_index": 19
            },
            "timestamp": "2025-07-17T00:30:06.374874354Z"
          },
          {
            "block": 114062,
            "event": "democracy.ExternalTabled",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374874464Z"
          },
          {
            "block": 114070,
            "event": "referenda.Rejected",
            "data": {
              "referendum_index": 18
            },
            "timestamp": "2025-07-17T00:30:06.374874644Z"
          },
          {
            "block": 114071,
            "event": "referenda.Killed",
            "data": {
              "referendum_index": 19
            },
            "timestamp": "2025-07-17T00:30:06.374874834Z"
          },
          {
            "block": 114072,
            "event": "referenda.Cancelled",
            "data": {
              "referendum_index": 20
            },
            "timestamp": "2025-07-17T00:30:06.374875044Z"
          },
          {
            "block": 114070,
            "event": "system.KilledAccount",
            "data": {
              "account": "5HGjWAeFD...Bad"
            },
            "timestamp": "2025-07-17T00:30:06.374875244Z"
          },
          {
            "block": 114071,
            "event": "system.ExtrinsicFailed",
            "data": {
              "dispatch_error": {
                "error": "NotController",
                "module": "Staking"
              },
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 300000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374878154Z"
          },
          {
            "block": 114072,
            "event": "system.ExtrinsicFailed",
            "data": {
              "dispatch_error": {
                "error": "InsufficientFunds",
                "module": "System"
              },
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 200000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374878764Z"
          },
          {
            "block": 114080,
            "event": "babe.EpochStarted",
            "data": {
              "epoch_index": 1100
            },
            "timestamp": "2025-07-17T00:30:06.374885344Z"
          },
          {
            "block": 114081,
            "event": "babe.EpochFinalized",
            "data": {
              "epoch_index": 1099
            },
            "timestamp": "2025-07-17T00:30:06.374885614Z"
          },
          {
            "block": 112034,
            "event": "staking.Bonded",
            "data": {
              "amount": 500000000000,
              "stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374707664Z"
          },
          {
            "block": 112035,
            "event": "staking.ValidatorPrefsSet",
            "data": {
              "prefs": {
                "commission": 0
              },
              "stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374717014Z"
          },
          {
            "block": 112040,
            "event": "staking.StakersElected",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374717134Z"
          },
          {
            "block": 112041,
            "event": "staking.OldSlashingReportDiscarded",
            "data": {
              "session_index": 229
            },
            "timestamp": "2025-07-17T00:30:06.374717344Z"
          },
          {
            "block": 112048,
            "event": "session.NewSession",
            "data": {
              "session_index": 230
            },
            "timestamp": "2025-07-17T00:30:06.374717554Z"
          },
          {
            "block": 112049,
            "event": "imOnline.HeartbeatReceived",
            "data": {
              "authority_id": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374717754Z"
          },
          {
            "block": 112050,
            "event": "imOnline.AllGood",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374717854Z"
          },
          {
            "block": 112051,
            "event": "session.NewSession",
            "data": {
              "session_index": 231
            },
            "timestamp": "2025-07-17T00:30:06.374718034Z"
          },
          {
            "block": 112052,
            "event": "imOnline.HeartbeatReceived",
            "data": {
              "authority_id": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374718214Z"
          },
          {
            "block": 112053,
            "event": "imOnline.AllGood",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374718324Z"
          },
          {
            "block": 112072,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 1004,
              "next": null,
              "page": 0,
              "validator_stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374725414Z"
          },
          {
            "block": 112073,
            "event": "staking.Rewarded",
            "data": {
              "amount": 14783456789,
              "dest": "Stash",
              "stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374725794Z"
          },
          {
            "block": 112074,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 1004,
              "remainder": 201654321,
              "validator_payout": 14783456789
            },
            "timestamp": "2025-07-17T00:30:06.374726204Z"
          },
          {
            "block": 112075,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 1005,
              "next": null,
              "page": 0,
              "validator_stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374726534Z"
          },
          {
            "block": 112076,
            "event": "staking.Rewarded",
            "data": {
              "amount": 15219876543,
              "dest": "Stash",
              "stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374726784Z"
          },
          {
            "block": 112077,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 1005,
              "remainder": 180123457,
              "validator_payout": 15219876543
            },
            "timestamp": "2025-07-17T00:30:06.374729604Z"
          },
          {
            "block": 112078,
            "event": "staking.PayoutStarted",
            "data": {
              "era_index": 1006,
              "next": null,
              "page": 0,
              "validator_stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374729924Z"
          },
          {
            "block": 112079,
            "event": "staking.Rewarded",
            "data": {
              "amount": 14987654321,
              "dest": "Stash",
              "stash": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374730184Z"
          },
          {
            "block": 112080,
            "event": "staking.EraPaid",
            "data": {
              "era_index": 1006,
              "remainder": 123456789,
              "validator_payout": 14987654321
            },
            "timestamp": "2025-07-17T00:30:06.374730454Z"
          },
          {
            "block": 112090,
            "event": "democracy.Proposed",
            "data": {
              "deposit": 50000000000,
              "proposal_index": 45
            },
            "timestamp": "2025-07-17T00:30:06.374730934Z"
          },
          {
            "block": 112091,
            "event": "democracy.Seconded",
            "data": {
              "proposal_index": 45,
              "seconder": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374731244Z"
          },
          {
            "block": 112092,
            "event": "democracy.Seconded",
            "data": {
              "proposal_index": 46,
              "seconder": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374731474Z"
          },
          {
            "block": 112093,
            "event": "democracy.Proposed",
            "data": {
              "deposit": 75000000000,
              "proposal_index": 46
            },
            "timestamp": "2025-07-17T00:30:06.374731694Z"
          },
          {
            "block": 112094,
            "event": "democracy.Started",
            "data": {
              "referendum_index": 22,
              "threshold": "SuperMajorityApprove"
            },
            "timestamp": "2025-07-17T00:30:06.374731924Z"
          },
          {
            "block": 112095,
            "event": "democracy.Voted",
            "data": {
              "ref_index": 22,
              "vote": {
                "Standard": {
                  "balance": 100000000000,
                  "vote": "aye"
                }
              },
              "voter": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374741824Z"
          },
          {
            "block": 112096,
            "event": "democracy.Passed",
            "data": {
              "ref_index": 22
            },
            "timestamp": "2025-07-17T00:30:06.374742014Z"
          },
          {
            "block": 112097,
            "event": "democracy.Started",
            "data": {
              "referendum_index": 23,
              "threshold": "SimpleMajority"
            },
            "timestamp": "2025-07-17T00:30:06.374742254Z"
          },
          {
            "block": 112098,
            "event": "democracy.Voted",
            "data": {
              "ref_index": 23,
              "vote": {
                "Standard": {
                  "balance": 100000000000,
                  "vote": "nay"
                }
              },
              "voter": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374745194Z"
          },
          {
            "block": 112099,
            "event": "democracy.NotPassed",
            "data": {
              "ref_index": 23
            },
            "timestamp": "2025-07-17T00:30:06.374745394Z"
          },
          {
            "block": 112120,
            "event": "referenda.Submitted",
            "data": {
              "proposal_hash": "0x1234567890abcdef",
              "referendum_index": 25
            },
            "timestamp": "2025-07-17T00:30:06.374745634Z"
          },
          {
            "block": 112121,
            "event": "referenda.DecisionDepositPlaced",
            "data": {
              "amount": 100000000000,
              "referendum_index": 25,
              "who": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374745974Z"
          },
          {
            "block": 112122,
            "event": "referenda.DecisionStarted",
            "data": {
              "conviction": "Locked1x",
              "referendum_index": 25,
              "track": 0
            },
            "timestamp": "2025-07-17T00:30:06.374746244Z"
          },
          {
            "block": 112123,
            "event": "referenda.Confirmed",
            "data": {
              "referendum_index": 22
            },
            "timestamp": "2025-07-17T00:30:06.374746574Z"
          },
          {
            "block": 112124,
            "event": "referenda.Confirmed",
            "data": {
              "referendum_index": 25
            },
            "timestamp": "2025-07-17T00:30:06.374746954Z"
          },
          {
            "block": 112130,
            "event": "system.ExtrinsicSuccess",
            "data": {
              "dispatch_info": {
                "class": "Normal",
                "pays_fee": true,
                "weight": 1000000
              }
            },
            "timestamp": "2025-07-17T00:30:06.374754174Z"
          },
          {
            "block": 112131,
            "event": "system.NewAccount",
            "data": {
              "account": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374754374Z"
          },
          {
            "block": 112132,
            "event": "system.Remarked",
            "data": {
              "hash": "0xabcdef1234567890",
              "sender": "5F3sa2TJc...Good"
            },
            "timestamp": "2025-07-17T00:30:06.374754604Z"
          },
          {
            "block": 112140,
            "event": "babe.EpochStarted",
            "data": {
              "epoch_index": 1150
            },
            "timestamp": "2025-07-17T00:30:06.374754914Z"
          },
          {
            "block": 112141,
            "event": "babe.EpochFinalized",
            "data": {
              "epoch_index": 1149
            },
            "timestamp": "2025-07-17T00:30:06.374755094Z"
          },
          {
            "block": 112142,
            "event": "babe.AuthoritiesChanged",
            "data": {},
            "timestamp": "2025-07-17T00:30:06.374755204Z"
          }
        ]
      },
      "txHash": "0xa34aa273caeed73233f67e4389380d36152da02de44aa73fa381b619416ef5ee",
      "blockNumber": 8785549,
      "explorerLink": "https://sepolia.etherscan.io/tx/0xa34aa273caeed73233f67e4389380d36152da02de44aa73fa381b619416ef5ee"
    }
  ],
  "total": 1
};

// Function to handle the /example endpoint
export function handleExampleEndpoint(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(exampleData));
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
}

// Export the example data for potential reuse
export { exampleData }; 