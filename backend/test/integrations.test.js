import assert from "node:assert/strict";
import test from "node:test";
import { SyntheticSearchAnalyticsProvider, SyntheticWebAnalyticsProvider } from "../src/integrations/analyticsProviders.js";
import { SyntheticCRMConversionProvider } from "../src/integrations/crmConversionProvider.js";
import { SyntheticWordPressConnector } from "../src/integrations/wordpressConnector.js";

test("synthetic analytics adapters return tenant-scoped demo data", async () => {
  const search = await new SyntheticSearchAnalyticsProvider().queryPerformance({ siteId: "demo-site-0001" });
  const web = await new SyntheticWebAnalyticsProvider().queryLandingPages({ siteId: "demo-site-0001" });
  assert.equal(search.siteId, "demo-site-0001");
  assert.equal(web.siteId, "demo-site-0001");
  assert.ok(search.rows.every((row) => Number.isFinite(row.impressions)));
  assert.ok(web.rows.every((row) => Number.isFinite(row.conversions)));
});

test("generic CRM adapter returns synthetic conversions", async () => {
  const rows = await new SyntheticCRMConversionProvider().syncConversions({ organizationId: "demo-org-0001" });
  assert.ok(rows.length > 0);
  assert.ok(rows.every((row) => row.organizationId === "demo-org-0001"));
  assert.ok(rows.every((row) => row.id.startsWith("demo-")));
});

test("WordPress adapter refuses unapproved changes", async () => {
  const connector = new SyntheticWordPressConnector();
  await assert.rejects(() => connector.publishApprovedChange({ id: "demo-change-0001", status: "pending-review" }), /Only approved/);
});

test("WordPress adapter simulates publishing approved changes", async () => {
  const connector = new SyntheticWordPressConnector();
  const result = await connector.publishApprovedChange({ id: "demo-change-0001", status: "approved" });
  assert.equal(result.status, "simulated");
  assert.match(result.externalId, /^demo-wp-/);
});

