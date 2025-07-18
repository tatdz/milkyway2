import { ApiPromise, WsProvider } from "@polkadot/api";

let apiInstance: ApiPromise | null = null;

export async function getPolkadotApi(): Promise<ApiPromise> {
  if (apiInstance) {
    return apiInstance;
  }

  const wsProvider = new WsProvider("wss://rpc.polkadot.io");
  apiInstance = await ApiPromise.create({ provider: wsProvider });
  
  return apiInstance;
}

export async function fetchValidators() {
  try {
    const api = await getPolkadotApi();
    const validators = await api.query.session.validators();
    
    return Promise.all(
      validators.map(async (validatorId) => {
        const prefs = await api.query.staking.validators(validatorId);
        const identity = await api.query.identity.identityOf(validatorId);
        
        return {
          stash: validatorId.toString(),
          commission: prefs.commission.toNumber() / 10_000_000,
          blocked: prefs.blocked.isTrue,
          hasIdentity: identity.isSome,
        };
      })
    );
  } catch (error) {
    console.error("Failed to fetch validators:", error);
    throw error;
  }
}

export async function fetchValidatorEvents(validatorStash: string, fromBlock?: number, toBlock?: number) {
  try {
    const api = await getPolkadotApi();
    
    // This is a simplified example - in practice you'd need to query historical blocks
    // and filter events related to the specific validator
    const currentBlock = await api.rpc.chain.getBlock();
    const blockNumber = currentBlock.block.header.number.toNumber();
    
    // Mock events for demonstration
    return [
      {
        block: blockNumber - 100,
        event: "staking.Rewarded",
        data: { amount: "1000000000000" },
        timestamp: new Date(Date.now() - 100 * 6000), // ~6s per block
      },
      {
        block: blockNumber - 50,
        event: "imOnline.HeartbeatReceived",
        data: {},
        timestamp: new Date(Date.now() - 50 * 6000),
      },
    ];
  } catch (error) {
    console.error("Failed to fetch validator events:", error);
    throw error;
  }
}

export async function fetchGovernanceReferenda() {
  try {
    const api = await getPolkadotApi();
    
    // Fetch active referenda
    const referendaEntries = await api.query.referenda.referendumInfoFor.entries();
    
    return referendaEntries.map(([key, value]) => {
      const referendumId = key.args[0].toNumber();
      
      if (value.isOngoing) {
        const ongoing = value.asOngoing;
        
        return {
          id: referendumId,
          status: "Ongoing",
          track: ongoing.track.toString(),
          proposal: ongoing.proposal.toString(),
          title: `Referendum #${referendumId}`,
          description: `OpenGov proposal in progress...`,
        };
      }
      
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error("Failed to fetch governance referenda:", error);
    throw error;
  }
}
