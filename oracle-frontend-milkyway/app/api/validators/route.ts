import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return the new hardcoded data structure with 10 examples
    const data = {
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
              }
            ]
          },
          "txHash": "0xa34aa273caeed73233f67e4389380d36152da02de44aa73fa381b619416ef5ee",
          "blockNumber": 8785549,
          "explorerLink": "https://sepolia.etherscan.io/tx/0xa34aa273caeed73233f67e4389380d36152da02de44aa73fa381b619416ef5ee"
        }
      ],
      "total": 1
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch validator data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
