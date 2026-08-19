import { ForbiddenError, NotFoundError } from "./errors.js";

export class InMemoryStore {
  constructor(seed = {}) {
    this.organizations = [...(seed.organizations ?? [])];
    this.sites = [...(seed.sites ?? [])];
    this.pages = [...(seed.pages ?? [])];
    this.audits = [];
    this.findings = [];
    this.recommendations = [];
    this.proposedChanges = [];
    this.auditLogs = [];
  }

  requireOrganization(actor, organizationId) {
    if (actor.organizationId !== organizationId) {
      throw new ForbiddenError("Cross-tenant access is not allowed");
    }
  }

  siteForActor(actor, siteId) {
    const site = this.sites.find((candidate) => candidate.id === siteId);
    if (!site) throw new NotFoundError("Site not found");
    this.requireOrganization(actor, site.organizationId);
    return site;
  }

  auditForActor(actor, auditId) {
    const audit = this.audits.find((candidate) => candidate.id === auditId);
    if (!audit) throw new NotFoundError("Audit not found");
    this.requireOrganization(actor, audit.organizationId);
    return audit;
  }
}

