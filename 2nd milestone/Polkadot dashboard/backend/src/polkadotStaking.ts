// src/oracles/validatorOracle.ts

import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// From your Milkyway project structure
import { OracleConfig } from '../config';
import { storeValidatorData } from '../storage';
import { sendXcmMessage } from '../xcm';

interface ValidatorInfo {
  address: string;
  isActive: boolean;
  totalStake: string;
  ownStake: string;
  commission: string;
  nominators: {
    address: string;
    stake: string;
  }[];
  identity?: {
    display: string;
    verified: boolean;
  };
}

class ValidatorOracle {
  private api: ApiPromise;
  private config: OracleConfig;

  constructor(config: OracleConfig) {
    this.config = config;
  }

  async initialize() {
    await cryptoWaitReady();
    this.api = await ApiPromise.create({
      provider: new WsProvider(this.config.rpcEndpoint),
      ...this.config.apiOptions
    });
  }

  async fetchValidatorData(validatorAddress: string): Promise<ValidatorInfo> {
    const [activeValidators, activeEra] = await Promise.all([
      this.api.query.session.validators(),
      this.api.query.staking.activeEra()
    ]);

    const era = activeEra.unwrap().index.toNumber();
    const isActive = activeValidators.some(v => v.toString() === validatorAddress);

    // Get staking info
    const exposure = await this.api.query.staking.erasStakers(era, validatorAddress);
    const prefs = await this.api.query.staking.validators(validatorAddress);
    const identity = await this.api.derive.accounts.info(validatorAddress).catch(() => null);

    return {
      address: validatorAddress,
      isActive,
      totalStake: formatBalance(exposure.total),
      ownStake: formatBalance(exposure.own),
      commission: (prefs.commission.unwrap().toNumber() / 10_000_000).toFixed(2) + '%',
      nominators: exposure.others.map(n => ({
        address: n.who.toString(),
        stake: formatBalance(n.value)
      })),
      identity: identity?.identity ? {
        display: identity.identity.display || 'None',
        verified: identity.identity.isVerified
      } : undefined
    };
  }

  async monitorValidators(validatorAddresses: string[]) {
    for (const address of validatorAddresses) {
      try {
        const data = await this.fetchValidatorData(address);
        await storeValidatorData(data); // From your storage module
        
        // Optional: Send via XCM if needed
        if (this.config.xcmEnabled) {
          await this.sendValidatorUpdateViaXcm(data);
        }

        console.log(`Updated validator: ${address}`);
      } catch (error) {
        console.error(`Error monitoring validator ${address}:`, error);
      }
    }
  }

  private async sendValidatorUpdateViaXcm(data: ValidatorInfo) {
    // Custom XCM message construction based on your needs
    const message = {
      origin: this.config.originChain,
      destination: this.config.destinationChain,
      message: {
        type: 'ValidatorUpdate',
        data: {
          address: data.address,
          stake: data.totalStake,
          active: data.isActive
        }
      }
    };

    await sendXcmMessage(this.api, message); // From your XCM module
  }

  async start(intervalMs: number = 300000) { // 5 minutes by default
    await this.initialize();
    console.log('Validator Oracle started');
    
    // Initial run
    await this.monitorValidators(this.config.validatorsToMonitor);
    
    // Periodic updates
    setInterval(async () => {
      await this.monitorValidators(this.config.validatorsToMonitor);
    }, intervalMs);
  }
}

// Configuration (similar to your Milkyway config)
const config: OracleConfig = {
  rpcEndpoint: 'wss://rpc.polkadot.io',
  validatorsToMonitor: [
    '12xtAYsRUrmbniiWQqJtECiBQrMn8AypQcXhnQAc6RB6XkLW',
    '16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD'
  ],
  originChain: 'polkadot',
  destinationChain: 'milkyway', // Your target chain
  xcmEnabled: true,
  apiOptions: {
    throwOnConnect: true
  }
};

// Initialize and start the oracle
const oracle = new ValidatorOracle(config);
oracle.start().catch(console.error);