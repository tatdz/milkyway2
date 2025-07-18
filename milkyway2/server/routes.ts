import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValidatorSchema, insertIncidentReportSchema, insertReferendumSchema, insertEncryptedMessageSchema, insertValidatorKeySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (req, res) => {
    res.json({
      success: true,
      data: {
        status: "healthy",
        service: "milkyway2-api",
        version: "1.0.0"
      }
    });
  });

  // Validators endpoints
  app.get("/api/validators", async (req, res) => {
    try {
      const validators = await storage.getValidators();
      res.json({ success: true, data: validators });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch validators" });
    }
  });

  app.get("/api/validators/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (!["good", "neutral", "bad"].includes(type)) {
        return res.status(400).json({ success: false, error: "Invalid validator type" });
      }
      const validators = await storage.getValidatorsByType(type);
      res.json({ success: true, data: validators });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch validators by type" });
    }
  });

  app.get("/api/validators/:id/events", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const events = await storage.getValidatorEvents(id);
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch validator events" });
    }
  });

  app.post("/api/validators", async (req, res) => {
    try {
      const validatorData = insertValidatorSchema.parse(req.body);
      const validator = await storage.createValidator(validatorData);
      res.status(201).json({ success: true, data: validator });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid validator data" });
    }
  });

  // Events endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const { startBlock, endBlock, eventType } = req.query;
      
      let events;
      if (startBlock && endBlock) {
        events = await storage.getEventsByBlock(Number(startBlock), Number(endBlock));
      } else if (eventType) {
        events = await storage.getEventsByType(String(eventType));
      } else {
        // Return all events for all validators
        const validators = await storage.getValidators();
        events = [];
        for (const validator of validators) {
          const validatorEvents = await storage.getValidatorEvents(validator.id);
          events.push(...validatorEvents);
        }
      }
      
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch events" });
    }
  });

  // Incident reports endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getIncidentReports();
      res.json({ success: true, data: reports });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch incident reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = insertIncidentReportSchema.parse(req.body);
      const report = await storage.createIncidentReport(reportData);
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid report data" });
    }
  });

  app.post("/api/reports/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.verifyIncidentReport(id);
      if (!report) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to verify report" });
    }
  });

  // Governance/Referenda endpoints
  app.get("/api/referenda", async (req, res) => {
    try {
      const referenda = await storage.getReferenda();
      res.json({ success: true, data: referenda });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch referenda" });
    }
  });

  app.get("/api/referenda/:id", async (req, res) => {
    try {
      const referendumId = parseInt(req.params.id);
      const referendum = await storage.getReferendum(referendumId);
      if (!referendum) {
        return res.status(404).json({ success: false, error: "Referendum not found" });
      }
      res.json({ success: true, data: referendum });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch referendum" });
    }
  });

  app.post("/api/referenda", async (req, res) => {
    try {
      const referendumData = insertReferendumSchema.parse(req.body);
      const referendum = await storage.createReferendum(referendumData);
      res.status(201).json({ success: true, data: referendum });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid referendum data" });
    }
  });

  // Network status endpoint
  app.get("/api/network/status", async (req, res) => {
    try {
      // This would typically fetch real-time data from Polkadot API
      const networkStatus = {
        currentBlock: 18234567,
        blockTime: "6.2s",
        era: 1234,
        session: 5678,
        health: 97.2,
        activeValidators: 1247,
        totalAlerts: 23,
        zkReports: 156
      };
      res.json({ success: true, data: networkStatus });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch network status" });
    }
  });

  // Encrypted Messages endpoints
  app.get("/api/messages", async (req, res) => {
    try {
      const groupKeyId = req.query.groupId as string;
      const messages = groupKeyId 
        ? await storage.getEncryptedMessagesByGroup(groupKeyId)
        : await storage.getEncryptedMessages();
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertEncryptedMessageSchema.parse(req.body);
      const message = await storage.createEncryptedMessage(messageData);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid message data" });
    }
  });

  app.post("/api/messages/unlock/:groupId", async (req, res) => {
    try {
      const { groupId } = req.params;
      const unlockedMessages = await storage.unlockMessages(groupId);
      res.json({ success: true, data: unlockedMessages });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to unlock messages" });
    }
  });

  // Validator Keys endpoints
  app.get("/api/validator-keys", async (req, res) => {
    try {
      const keys = await storage.getValidatorKeys();
      res.json({ success: true, data: keys });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch validator keys" });
    }
  });

  app.post("/api/validator-keys", async (req, res) => {
    try {
      const keyData = insertValidatorKeySchema.parse(req.body);
      const key = await storage.createValidatorKey(keyData);
      res.status(201).json({ success: true, data: key });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid key data" });
    }
  });

  app.get("/api/validator-keys/:address/:groupId", async (req, res) => {
    try {
      const { address, groupId } = req.params;
      const key = await storage.getValidatorKey(address, groupId);
      if (!key) {
        return res.status(404).json({ success: false, error: "Validator key not found" });
      }
      res.json({ success: true, data: key });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch validator key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
