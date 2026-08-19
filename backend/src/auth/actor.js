import { DomainError } from "../domain/errors.js";

export function requireActor(req, _res, next) {
  const userId = req.header("x-demo-user-id");
  const organizationId = req.header("x-demo-organization-id");
  const role = req.header("x-demo-role") ?? "analyst";
  if (!userId || !organizationId) return next(new DomainError("Demo authentication headers are required", 401));
  req.actor = { userId, organizationId, role };
  next();
}

