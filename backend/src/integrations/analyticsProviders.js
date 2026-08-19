export class SearchAnalyticsProvider {
  async queryPerformance() {
    throw new Error("queryPerformance must be implemented");
  }
}

export class WebAnalyticsProvider {
  async queryLandingPages() {
    throw new Error("queryLandingPages must be implemented");
  }
}

export class SyntheticSearchAnalyticsProvider extends SearchAnalyticsProvider {
  async queryPerformance({ siteId }) {
    return {
      siteId,
      source: "synthetic-gsc-adapter",
      rows: [
        { query: "roof repair vancouver", clicks: 42, impressions: 640, position: 8.4 },
        { query: "gutter cleaning burnaby", clicks: 27, impressions: 410, position: 11.2 },
      ],
    };
  }
}

export class SyntheticWebAnalyticsProvider extends WebAnalyticsProvider {
  async queryLandingPages({ siteId }) {
    return {
      siteId,
      source: "synthetic-ga4-adapter",
      rows: [
        { path: "/services/roof-repair", sessions: 380, conversions: 18 },
        { path: "/services/gutter-cleaning", sessions: 240, conversions: 11 },
      ],
    };
  }
}

