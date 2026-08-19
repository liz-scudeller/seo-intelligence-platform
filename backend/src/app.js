import cors from "cors";
import express from "express";
import { requireActor } from "./auth/actor.js";
import { AuditService } from "./domain/auditService.js";
import { InMemoryStore } from "./domain/store.js";
import { syntheticFixture } from "./demo/fixtures.js";
import { SyntheticSearchAnalyticsProvider, SyntheticWebAnalyticsProvider } from "./integrations/analyticsProviders.js";
import { SyntheticCRMConversionProvider } from "./integrations/crmConversionProvider.js";
import { SyntheticWordPressConnector } from "./integrations/wordpressConnector.js";

export function createApp({ store = new InMemoryStore(syntheticFixture) } = {}) {
  const app = express();
  const audits = new AuditService(store);
  const searchAnalytics = new SyntheticSearchAnalyticsProvider();
  const webAnalytics = new SyntheticWebAnalyticsProvider();
  const crm = new SyntheticCRMConversionProvider();
  const wordpress = new SyntheticWordPressConnector();
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", requireActor);

  app.get("/api/sites", (req, res) => res.json(store.sites.filter((site) => site.organizationId === req.actor.organizationId)));
  app.post("/api/audits", (req, res, next) => {
    try { res.status(201).json(audits.createAudit(req.actor, req.body.siteId)); } catch (error) { next(error); }
  });
  app.post("/api/audits/:auditId/run", (req, res, next) => {
    try { res.json(audits.runAudit(req.actor, req.params.auditId)); } catch (error) { next(error); }
  });
  app.post("/api/changes/:changeId/approve", (req, res, next) => {
    try { res.json(audits.approveChange(req.actor, req.params.changeId)); } catch (error) { next(error); }
  });
  app.post("/api/changes/:changeId/publish", async (req, res, next) => {
    try {
      const change = store.proposedChanges.find((candidate) => candidate.id === req.params.changeId);
      store.requireOrganization(req.actor, change?.organizationId);
      res.json(await wordpress.publishApprovedChange(change));
    } catch (error) { next(error); }
  });
  app.get("/api/integrations/synthetic", async (req, res) => {
    const site = store.sites.find((candidate) => candidate.organizationId === req.actor.organizationId);
    res.json({
      search: await searchAnalytics.queryPerformance({ siteId: site.id }),
      web: await webAnalytics.queryLandingPages({ siteId: site.id }),
      conversions: await crm.syncConversions({ organizationId: req.actor.organizationId }),
    });
  });
  app.get("/api/audit-logs", (req, res) => res.json(store.auditLogs.filter((log) => log.organizationId === req.actor.organizationId)));

  app.use((error, _req, res, _next) => res.status(error.status ?? 500).json({ error: error.message ?? "Unexpected error" }));
  return { app, store };
}

