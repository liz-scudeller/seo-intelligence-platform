import { collectDeterministicFindings } from "./auditEngine.js";
import { generateRecommendations } from "./recommendationEngine.js";
import { createId } from "./ids.js";
import { ForbiddenError, NotFoundError } from "./errors.js";

export class AuditService {
  constructor(store) {
    this.store = store;
  }

  createAudit(actor, siteId) {
    const site = this.store.siteForActor(actor, siteId);
    const audit = { id: createId("audit"), organizationId: site.organizationId, siteId, status: "queued", createdBy: actor.userId };
    this.store.audits.push(audit);
    this.log(actor, "audit.created", "audit", audit.id);
    return audit;
  }

  runAudit(actor, auditId) {
    const audit = this.store.auditForActor(actor, auditId);
    audit.status = "running";
    const pages = this.store.pages.filter((page) => page.siteId === audit.siteId);
    const findings = pages.flatMap((page) => collectDeterministicFindings(page).map((finding) => ({
      ...finding,
      id: createId("finding"),
      auditId,
      organizationId: audit.organizationId,
    })));
    this.store.findings.push(...findings);
    const recommendations = generateRecommendations(findings).map((recommendation) => ({
      ...recommendation,
      id: createId("recommendation"),
      auditId,
      organizationId: audit.organizationId,
      status: "proposed",
    }));
    this.store.recommendations.push(...recommendations);
    for (const recommendation of recommendations) {
      this.store.proposedChanges.push({
        id: createId("change"),
        recommendationId: recommendation.id,
        organizationId: audit.organizationId,
        field: recommendation.field,
        proposedValue: recommendation.suggestedValue,
        status: "pending-review",
      });
    }
    audit.status = "completed";
    audit.completedAt = new Date().toISOString();
    this.log(actor, "audit.completed", "audit", audit.id, { findingCount: findings.length });
    return { audit, findings, recommendations };
  }

  approveChange(actor, changeId) {
    const change = this.store.proposedChanges.find((candidate) => candidate.id === changeId);
    if (!change) throw new NotFoundError("Proposed change not found");
    this.store.requireOrganization(actor, change.organizationId);
    if (!['owner', 'reviewer'].includes(actor.role)) throw new ForbiddenError("Reviewer role required");
    change.status = "approved";
    change.approvedBy = actor.userId;
    this.log(actor, "change.approved", "proposed-change", change.id);
    return change;
  }

  log(actor, action, entityType, entityId, metadata = {}) {
    this.store.auditLogs.push({ id: createId("log"), organizationId: actor.organizationId, actorId: actor.userId, action, entityType, entityId, metadata, createdAt: new Date().toISOString() });
  }
}

