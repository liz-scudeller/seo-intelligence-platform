export const syntheticFixture = {
  organizations: [
    { id: "demo-org-0001", name: "Example Home Services" },
    { id: "demo-org-0002", name: "Example Property Care" },
  ],
  sites: [
    { id: "demo-site-0001", organizationId: "demo-org-0001", name: "Example Home Services", url: "https://example.com" },
    { id: "demo-site-0002", organizationId: "demo-org-0002", name: "Example Property Care", url: "https://example.org" },
  ],
  pages: [
    { id: "demo-page-0001", siteId: "demo-site-0001", path: "/services/roof-repair-vancouver", title: "", metaDescription: "Roof repair.", h1: "Roof Repair in Vancouver", statusCode: 200, wordCount: 220 },
    { id: "demo-page-0002", siteId: "demo-site-0001", path: "/services/gutter-cleaning-burnaby", title: "Gutter Cleaning in Burnaby", metaDescription: "Synthetic service page for gutter cleaning in Burnaby.", h1: "", statusCode: 200, wordCount: 480 },
    { id: "demo-page-0003", siteId: "demo-site-0001", path: "/services/window-installation-richmond", title: "Window Installation in Richmond", metaDescription: "Synthetic window installation page.", h1: "Window Installation", statusCode: 404, wordCount: 510 },
    { id: "demo-page-0004", siteId: "demo-site-0002", path: "/services/example", title: "Example Service", metaDescription: "A fully synthetic page owned by another tenant for isolation tests.", h1: "Example Service", statusCode: 200, wordCount: 500 },
  ],
};

