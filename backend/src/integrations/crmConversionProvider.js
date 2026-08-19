export class CRMConversionProvider {
  async syncConversions() {
    throw new Error("syncConversions must be implemented");
  }
}

export class SyntheticCRMConversionProvider extends CRMConversionProvider {
  async syncConversions({ organizationId }) {
    return [
      { id: "demo-conversion-0001", organizationId, lead: "Synthetic Lead A", source: "organic-search", campaign: "roof-repair-demo", value: 1250 },
      { id: "demo-conversion-0002", organizationId, lead: "Synthetic Lead B", source: "local-search", campaign: "gutter-cleaning-demo", value: 640 },
    ];
  }
}

