import { useState } from "react";

const pages = [
  { path: "/services/roof-repair-vancouver", service: "Roof Repair", location: "Vancouver", score: 68, findings: 3 },
  { path: "/services/gutter-cleaning-burnaby", service: "Gutter Cleaning", location: "Burnaby", score: 82, findings: 1 },
  { path: "/services/window-installation-richmond", service: "Window Installation", location: "Richmond", score: 54, findings: 2 },
];

const recommendations = [
  { id: "demo-recommendation-0001", severity: "High", title: "Add a descriptive page title", confidence: 86, status: "Pending review" },
  { id: "demo-recommendation-0002", severity: "Medium", title: "Expand the meta description", confidence: 86, status: "Pending review" },
  { id: "demo-recommendation-0003", severity: "Critical", title: "Restore an indexable response", confidence: 99, status: "Pending review" },
];

export function App() {
  const [items, setItems] = useState(recommendations);
  const approve = (id) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: "Approved" } : item));
  return (
    <div className="shell">
      <aside>
        <div className="brand"><span>SI</span><strong>SEO Intelligence</strong></div>
        <nav aria-label="Primary navigation">
          {['Overview', 'Sites', 'Audits', 'Recommendations', 'Integrations', 'Audit log'].map((item, index) => <a className={index === 0 ? 'active' : ''} href={`#${item.toLowerCase().replace(' ', '-')}`} key={item}>{item}</a>)}
        </nav>
        <div className="tenant"><small>DEMO ORGANIZATION</small><b>Example Home Services</b><span>demo-org-0001</span></div>
      </aside>
      <main>
        <header><div><p className="eyebrow">SYNTHETIC PORTFOLIO DEMO</p><h1>SEO operations overview</h1></div><button>Run technical audit</button></header>
        <section className="notice" aria-label="Demo notice"><strong>Human-in-the-loop by design.</strong> AI assists with recommendations; it never publishes changes autonomously.</section>
        <section className="metrics">
          <article><span>Site health</span><b>68</b><small>synthetic score</small></article>
          <article><span>Open findings</span><b>6</b><small>3 require review</small></article>
          <article><span>Organic sessions</span><b>1,240</b><small>synthetic 30-day data</small></article>
          <article><span>Approved changes</span><b>{items.filter((item) => item.status === 'Approved').length}</b><small>awaiting simulated publish</small></article>
        </section>
        <section className="grid">
          <article className="panel pages"><div className="panel-title"><div><p>Deterministic evidence</p><h2>Page audit results</h2></div><span>example.com</span></div>
            <table><thead><tr><th>Page</th><th>Location</th><th>Score</th><th>Findings</th></tr></thead><tbody>{pages.map((page) => <tr key={page.path}><td><b>{page.service}</b><small>{page.path}</small></td><td>{page.location}</td><td><span className={`score s${page.score}`}>{page.score}</span></td><td>{page.findings}</td></tr>)}</tbody></table>
          </article>
          <article className="panel"><div className="panel-title"><div><p>Analytics adapters</p><h2>Search opportunity</h2></div></div>
            <div className="chart" aria-label="Synthetic search opportunity bar chart"><div style={{height:'72%'}}><span>Roof repair</span></div><div style={{height:'48%'}}><span>Gutters</span></div><div style={{height:'61%'}}><span>Windows</span></div></div>
            <small>All values shown are synthetic.</small>
          </article>
        </section>
        <section className="panel" id="recommendations"><div className="panel-title"><div><p>Approval queue</p><h2>AI-assisted recommendations</h2></div><span>{items.length} proposed</span></div>
          <div className="recommendations">{items.map((item) => <article key={item.id}><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span><div><h3>{item.title}</h3><p>{item.confidence}% confidence · Evidence-backed suggestion</p></div><strong>{item.status}</strong><button disabled={item.status === 'Approved'} onClick={() => approve(item.id)}>{item.status === 'Approved' ? 'Approved' : 'Review & approve'}</button></article>)}</div>
        </section>
      </main>
    </div>
  );
}

