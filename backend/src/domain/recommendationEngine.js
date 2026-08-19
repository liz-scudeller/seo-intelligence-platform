const guidance = {
  "missing-title": { summary: "Add a descriptive page title", field: "title", suggestedValue: "Roof Repair in Vancouver | Example Home Services" },
  "short-meta-description": { summary: "Expand the meta description", field: "metaDescription", suggestedValue: "Synthetic example: professional roof repair services for homeowners in Vancouver." },
  "missing-h1": { summary: "Add a primary heading", field: "h1", suggestedValue: "Roof Repair in Vancouver" },
  "non-indexable-status": { summary: "Restore an indexable response", field: "statusCode", suggestedValue: 200 },
  "thin-content": { summary: "Add useful service information", field: "contentBrief", suggestedValue: "Explain scope, process, service area, and common customer questions." },
};

export function generateRecommendations(findings) {
  return findings.map((finding) => ({
    findingId: finding.id,
    confidence: finding.ruleCode === "non-indexable-status" ? 0.99 : 0.86,
    rationale: `Generated from deterministic rule: ${finding.ruleCode}`,
    ...guidance[finding.ruleCode],
  }));
}

