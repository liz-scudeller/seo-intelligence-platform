import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { AuditService } from "../src/domain/auditService.js";
import { resetIdsForTests } from "../src/domain/ids.js";
import { InMemoryStore } from "../src/domain/store.js";
import { syntheticFixture } from "../src/demo/fixtures.js";

const owner = { userId: "demo-user-owner", organizationId: "demo-org-0001", role: "owner" };
const analyst = { userId: "demo-user-analyst", organizationId: "demo-org-0001", role: "analyst" };
const otherTenant = { userId: "demo-user-other", organizationId: "demo-org-0002", role: "owner" };

let store;
let service;

beforeEach(() => {
  resetIdsForTests();
  store = new InMemoryStore(syntheticFixture);
  service = new AuditService(store);
});

test("creates an audit within the actor tenant", () => {
  const audit = service.createAudit(owner, "demo-site-0001");
  assert.equal(audit.organizationId, owner.organizationId);
  assert.equal(audit.status, "queued");
  assert.equal(store.auditLogs[0].action, "audit.created");
});

test("rejects cross-tenant audit creation", () => {
  assert.throws(() => service.createAudit(otherTenant, "demo-site-0001"), /Cross-tenant/);
  assert.equal(store.audits.length, 0);
});

test("generates evidence-backed findings and recommendations", () => {
  const audit = service.createAudit(owner, "demo-site-0001");
  const result = service.runAudit(owner, audit.id);
  assert.equal(result.audit.status, "completed");
  assert.ok(result.findings.length >= 3);
  assert.equal(result.recommendations.length, result.findings.length);
  assert.ok(result.findings.every((finding) => finding.evidence.field));
  assert.ok(result.recommendations.every((recommendation) => recommendation.rationale.includes("deterministic rule")));
});

test("analyst cannot approve a proposed change", () => {
  const audit = service.createAudit(owner, "demo-site-0001");
  service.runAudit(owner, audit.id);
  const change = store.proposedChanges[0];
  assert.throws(() => service.approveChange(analyst, change.id), /Reviewer role required/);
  assert.equal(change.status, "pending-review");
});

test("authorized reviewer approves and creates an audit log", () => {
  const audit = service.createAudit(owner, "demo-site-0001");
  service.runAudit(owner, audit.id);
  const change = service.approveChange(owner, store.proposedChanges[0].id);
  assert.equal(change.status, "approved");
  assert.equal(change.approvedBy, owner.userId);
  assert.ok(store.auditLogs.some((log) => log.action === "change.approved"));
});

