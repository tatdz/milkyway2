import { 
  validators, 
  validatorEvents, 
  incidentReports, 
  referenda,
  encryptedMessages,
  validatorKeys,
  type Validator, 
  type ValidatorEvent, 
  type IncidentReport, 
  type Referendum,
  type EncryptedMessage,
  type ValidatorKey,
  type InsertValidator, 
  type InsertValidatorEvent, 
  type InsertIncidentReport, 
  type InsertReferendum,
  type InsertEncryptedMessage,
  type InsertValidatorKey
} from "@shared/schema";

export interface IStorage {
  // Validators
  getValidators(): Promise<Validator[]>;
  getValidator(id: number): Promise<Validator | undefined>;
  getValidatorByStash(stash: string): Promise<Validator | undefined>;
  getValidatorsByType(type: string): Promise<Validator[]>;
  createValidator(validator: InsertValidator): Promise<Validator>;
  updateValidator(id: number, validator: Partial<InsertValidator>): Promise<Validator | undefined>;

  // Validator Events
  getValidatorEvents(validatorId: number): Promise<ValidatorEvent[]>;
  getEventsByBlock(startBlock: number, endBlock: number): Promise<ValidatorEvent[]>;
  getEventsByType(eventType: string): Promise<ValidatorEvent[]>;
  createValidatorEvent(event: InsertValidatorEvent): Promise<ValidatorEvent>;

  // Incident Reports
  getIncidentReports(): Promise<IncidentReport[]>;
  getIncidentReportsByValidator(validatorStash: string): Promise<IncidentReport[]>;
  createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport>;
  verifyIncidentReport(id: number): Promise<IncidentReport | undefined>;

  // Referenda
  getReferenda(): Promise<Referendum[]>;
  getReferendum(referendumId: number): Promise<Referendum | undefined>;
  createReferendum(referendum: InsertReferendum): Promise<Referendum>;
  updateReferendum(referendumId: number, referendum: Partial<InsertReferendum>): Promise<Referendum | undefined>;

  // Encrypted Messages
  getEncryptedMessages(): Promise<EncryptedMessage[]>;
  getEncryptedMessagesByGroup(groupKeyId: string): Promise<EncryptedMessage[]>;
  createEncryptedMessage(message: InsertEncryptedMessage): Promise<EncryptedMessage>;
  unlockMessages(groupKeyId: string): Promise<EncryptedMessage[]>;

  // Validator Keys
  getValidatorKeys(): Promise<ValidatorKey[]>;
  getValidatorKey(validatorAddress: string, groupKeyId: string): Promise<ValidatorKey | undefined>;
  createValidatorKey(key: InsertValidatorKey): Promise<ValidatorKey>;
}

export class MemStorage implements IStorage {
  private validators: Map<number, Validator>;
  private validatorEvents: Map<number, ValidatorEvent>;
  private incidentReports: Map<number, IncidentReport>;
  private referenda: Map<number, Referendum>;
  private encryptedMessages: Map<number, EncryptedMessage>;
  private validatorKeys: Map<number, ValidatorKey>;
  private currentValidatorId: number;
  private currentEventId: number;
  private currentReportId: number;
  private currentReferendumId: number;
  private currentMessageId: number;
  private currentKeyId: number;

  constructor() {
    this.validators = new Map();
    this.validatorEvents = new Map();
    this.incidentReports = new Map();
    this.referenda = new Map();
    this.encryptedMessages = new Map();
    this.validatorKeys = new Map();
    this.currentValidatorId = 1;
    this.currentEventId = 1;
    this.currentReportId = 1;
    this.currentReferendumId = 1;
    this.currentMessageId = 1;
    this.currentKeyId = 1;

    // Initialize with sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample validators
    const sampleValidators = [
      {
        stash: "5F3sa2TJAe...Good",
        type: "good",
        description: "Active every session, regular voter and delegate, always online, no slashes, earns consistent rewards, participates in governance",
        commission: 500,
        uptime: 99,
        slashed: false,
        eventsCount: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stash: "5F3sa2TJAe...Neutral", 
        type: "neutral",
        description: "Sometimes offline, occasional missed votes, moderate slash history",
        commission: 1200,
        uptime: 87,
        slashed: false,
        eventsCount: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stash: "5F3sa2TJAe...Bad",
        type: "bad", 
        description: "Frequently offline, many slashes, inconsistent performance, governance participation low",
        commission: 2500,
        uptime: 65,
        slashed: true,
        eventsCount: 42,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleValidators.forEach(validator => {
      const id = this.currentValidatorId++;
      this.validators.set(id, { ...validator, id });
    });

    // Sample referenda
    const sampleReferenda = [
      {
        referendumId: 234,
        title: "Referendum #234",
        description: "Proposal to fund ecosystem development initiatives for Q1 2025...",
        track: "Medium Spender",
        status: "Confirming",
        support: 67,
        timeLeft: "2d 14h left",
        totalVotes: "1.2M DOT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        referendumId: 235,
        title: "Referendum #235", 
        description: "Runtime upgrade to improve parachain efficiency and reduce transaction costs...",
        track: "Root",
        status: "Deciding",
        support: 45,
        timeLeft: "6d 8h left",
        totalVotes: "850K DOT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        referendumId: 236,
        title: "Referendum #236",
        description: "Treasury allocation for validator rewards optimization program...",
        track: "Treasurer", 
        status: "Submitted",
        support: 12,
        timeLeft: "14d 2h left",
        totalVotes: "124K DOT",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleReferenda.forEach(referendum => {
      const id = this.currentReferendumId++;
      this.referenda.set(id, { ...referendum, id });
    });
  }

  // Validators
  async getValidators(): Promise<Validator[]> {
    return Array.from(this.validators.values());
  }

  async getValidator(id: number): Promise<Validator | undefined> {
    return this.validators.get(id);
  }

  async getValidatorByStash(stash: string): Promise<Validator | undefined> {
    return Array.from(this.validators.values()).find(v => v.stash === stash);
  }

  async getValidatorsByType(type: string): Promise<Validator[]> {
    return Array.from(this.validators.values()).filter(v => v.type === type);
  }

  async createValidator(insertValidator: InsertValidator): Promise<Validator> {
    const id = this.currentValidatorId++;
    const validator: Validator = { 
      id,
      stash: insertValidator.stash,
      type: insertValidator.type,
      description: insertValidator.description,
      commission: insertValidator.commission ?? 0,
      uptime: insertValidator.uptime ?? 0,
      slashed: insertValidator.slashed ?? false,
      eventsCount: insertValidator.eventsCount ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.validators.set(id, validator);
    return validator;
  }

  async updateValidator(id: number, updateData: Partial<InsertValidator>): Promise<Validator | undefined> {
    const validator = this.validators.get(id);
    if (!validator) return undefined;
    
    const updated = { ...validator, ...updateData, updatedAt: new Date() };
    this.validators.set(id, updated);
    return updated;
  }

  // Validator Events
  async getValidatorEvents(validatorId: number): Promise<ValidatorEvent[]> {
    return Array.from(this.validatorEvents.values()).filter(e => e.validatorId === validatorId);
  }

  async getEventsByBlock(startBlock: number, endBlock: number): Promise<ValidatorEvent[]> {
    return Array.from(this.validatorEvents.values()).filter(
      e => e.block >= startBlock && e.block <= endBlock
    );
  }

  async getEventsByType(eventType: string): Promise<ValidatorEvent[]> {
    return Array.from(this.validatorEvents.values()).filter(e => e.event === eventType);
  }

  async createValidatorEvent(insertEvent: InsertValidatorEvent): Promise<ValidatorEvent> {
    const id = this.currentEventId++;
    const event: ValidatorEvent = { 
      id,
      validatorId: insertEvent.validatorId ?? null,
      block: insertEvent.block,
      event: insertEvent.event,
      data: insertEvent.data ?? null,
      timestamp: new Date(),
      hash: insertEvent.hash ?? null,
    };
    this.validatorEvents.set(id, event);
    return event;
  }

  // Incident Reports
  async getIncidentReports(): Promise<IncidentReport[]> {
    return Array.from(this.incidentReports.values());
  }

  async getIncidentReportsByValidator(validatorStash: string): Promise<IncidentReport[]> {
    return Array.from(this.incidentReports.values()).filter(r => r.validatorStash === validatorStash);
  }

  async createIncidentReport(insertReport: InsertIncidentReport): Promise<IncidentReport> {
    const id = this.currentReportId++;
    const report: IncidentReport = { 
      id,
      validatorStash: insertReport.validatorStash,
      incidentType: insertReport.incidentType,
      description: insertReport.description ?? null,
      nullifierHash: insertReport.nullifierHash,
      proof: insertReport.proof ?? null,
      isVerified: false,
      createdAt: new Date(),
    };
    this.incidentReports.set(id, report);
    return report;
  }

  async verifyIncidentReport(id: number): Promise<IncidentReport | undefined> {
    const report = this.incidentReports.get(id);
    if (!report) return undefined;
    
    const verified = { ...report, isVerified: true };
    this.incidentReports.set(id, verified);
    return verified;
  }

  // Referenda
  async getReferenda(): Promise<Referendum[]> {
    return Array.from(this.referenda.values());
  }

  async getReferendum(referendumId: number): Promise<Referendum | undefined> {
    return Array.from(this.referenda.values()).find(r => r.referendumId === referendumId);
  }

  async createReferendum(insertReferendum: InsertReferendum): Promise<Referendum> {
    const id = this.currentReferendumId++;
    const referendum: Referendum = { 
      id,
      referendumId: insertReferendum.referendumId,
      title: insertReferendum.title,
      description: insertReferendum.description ?? null,
      track: insertReferendum.track ?? null,
      status: insertReferendum.status,
      support: insertReferendum.support ?? 0,
      timeLeft: insertReferendum.timeLeft ?? null,
      totalVotes: insertReferendum.totalVotes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.referenda.set(id, referendum);
    return referendum;
  }

  async updateReferendum(referendumId: number, updateData: Partial<InsertReferendum>): Promise<Referendum | undefined> {
    const referendum = Array.from(this.referenda.values()).find(r => r.referendumId === referendumId);
    if (!referendum) return undefined;
    
    const updated = { ...referendum, ...updateData, updatedAt: new Date() };
    this.referenda.set(referendum.id, updated);
    return updated;
  }

  // Encrypted Messages methods
  async getEncryptedMessages(): Promise<EncryptedMessage[]> {
    return Array.from(this.encryptedMessages.values());
  }

  async getEncryptedMessagesByGroup(groupKeyId: string): Promise<EncryptedMessage[]> {
    return Array.from(this.encryptedMessages.values()).filter(m => m.groupKeyId === groupKeyId);
  }

  async createEncryptedMessage(message: InsertEncryptedMessage): Promise<EncryptedMessage> {
    const newMessage: EncryptedMessage = {
      id: this.currentMessageId++,
      ciphertext: message.ciphertext,
      signature: message.signature,
      senderAddress: message.senderAddress,
      blockNumber: message.blockNumber ?? null,
      transactionHash: message.transactionHash,
      timestamp: new Date(),
      isUnlocked: message.isUnlocked ?? false,
      groupKeyId: message.groupKeyId,
    };
    this.encryptedMessages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async unlockMessages(groupKeyId: string): Promise<EncryptedMessage[]> {
    const messages = Array.from(this.encryptedMessages.values()).filter(m => m.groupKeyId === groupKeyId);
    messages.forEach(message => {
      message.isUnlocked = true;
      this.encryptedMessages.set(message.id, message);
    });
    return messages;
  }

  // Validator Keys methods
  async getValidatorKeys(): Promise<ValidatorKey[]> {
    return Array.from(this.validatorKeys.values());
  }

  async getValidatorKey(validatorAddress: string, groupKeyId: string): Promise<ValidatorKey | undefined> {
    return Array.from(this.validatorKeys.values()).find(
      k => k.validatorAddress === validatorAddress && k.groupKeyId === groupKeyId
    );
  }

  async createValidatorKey(key: InsertValidatorKey): Promise<ValidatorKey> {
    const newKey: ValidatorKey = {
      id: this.currentKeyId++,
      ...key,
      createdAt: new Date(),
    };
    this.validatorKeys.set(newKey.id, newKey);
    return newKey;
  }
}

export const storage = new MemStorage();
