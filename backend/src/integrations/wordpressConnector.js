import { ForbiddenError } from "../domain/errors.js";

export class WordPressConnector {
  async validateConnection() {
    throw new Error("validateConnection must be implemented");
  }

  async publishApprovedChange() {
    throw new Error("publishApprovedChange must be implemented");
  }
}

export class SyntheticWordPressConnector extends WordPressConnector {
  async validateConnection({ siteUrl }) {
    return { connected: true, siteUrl, mode: "synthetic" };
  }

  async publishApprovedChange(change) {
    if (change.status !== "approved") throw new ForbiddenError("Only approved changes can be published");
    return { externalId: `demo-wp-${change.id}`, status: "simulated", publishedAt: new Date().toISOString() };
  }
}

