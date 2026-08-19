const rules = [
  {
    code: "missing-title",
    severity: "high",
    test: (page) => !page.title?.trim(),
    evidence: () => ({ field: "title", observed: "missing" }),
  },
  {
    code: "short-meta-description",
    severity: "medium",
    test: (page) => (page.metaDescription?.trim().length ?? 0) < 70,
    evidence: (page) => ({ field: "metaDescription", observedLength: page.metaDescription?.trim().length ?? 0 }),
  },
  {
    code: "missing-h1",
    severity: "high",
    test: (page) => !page.h1?.trim(),
    evidence: () => ({ field: "h1", observed: "missing" }),
  },
  {
    code: "non-indexable-status",
    severity: "critical",
    test: (page) => page.statusCode !== 200,
    evidence: (page) => ({ field: "statusCode", observed: page.statusCode }),
  },
  {
    code: "thin-content",
    severity: "medium",
    test: (page) => page.wordCount < 300,
    evidence: (page) => ({ field: "wordCount", observed: page.wordCount }),
  },
];

export function collectDeterministicFindings(page) {
  return rules.filter((rule) => rule.test(page)).map((rule) => ({
    ruleCode: rule.code,
    severity: rule.severity,
    pageId: page.id,
    evidence: rule.evidence(page),
  }));
}

