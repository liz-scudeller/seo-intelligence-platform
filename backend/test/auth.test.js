import assert from "node:assert/strict";
import test from "node:test";
import { requireActor } from "../src/auth/actor.js";

function run(headers) {
  let error;
  const req = { header: (name) => headers[name] };
  requireActor(req, {}, (value) => { error = value; });
  return { req, error };
}

test("authentication rejects missing identity headers", () => {
  const { error } = run({});
  assert.equal(error.status, 401);
});

test("authentication creates a least-privileged actor by default", () => {
  const { req, error } = run({ "x-demo-user-id": "demo-user-0001", "x-demo-organization-id": "demo-org-0001" });
  assert.equal(error, undefined);
  assert.equal(req.actor.role, "analyst");
});

