# Blocks — AI-Assisted Portfolio Construction

> Interactive product demo and landing page for **Blocks**, an AI-powered portfolio construction platform for financial advisors.

🌐 **Live site:** [blocks-demo.netlify.app](https://blocks-demo.netlify.app)

---

## What is Blocks?

Blocks is a concept for an AI-assisted portfolio construction tool that helps financial advisors — whether they currently build portfolios themselves or outsource to a TAMP/UMA — build, manage, and monitor client portfolios more efficiently. The AI does the screening grunt work; the advisor stays in control of every decision.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — pitch, problem/solution, how it works, waitlist signup |
| `dashboard.html` | Advisor dashboard — client sentiment, risk status, block library, composites |
| `clients.html` | Client book management — sentiment tracking, drift alerts, AUM overview |
| `blocks-builder.html` | AI Block Builder — natural language security screening |
| `composites.html` | Composite model portfolios — performance, allocation, benchmarks |
| `signals.html` | Market signals — AI recommendations, sector heatmap, approval modal |
| `assembly.html` | Portfolio Assembly — build portfolios from blocks with live analytics |
| `proposal.html` | Client Proposal — printable one-pager with allocation chart and signature |

---

## Tech stack

- Pure HTML, CSS, JavaScript — no frameworks, no build step
- [Google Fonts](https://fonts.google.com) — Syne + DM Sans + DM Mono
- Netlify Forms — waitlist email capture on the landing page
- Hosted on [Netlify](https://netlify.com) free tier

---

## Local development

No build tools needed. Just open any HTML file directly in a browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/blocks-demo.git
cd blocks-demo

# Open in browser (Mac)
open index.html

# Or use a simple local server
npx serve .
```

---

## Deploying to Netlify

This repo is connected to Netlify for automatic deploys. Any commit to the `main` branch triggers a new deploy automatically.

To set up the connection from scratch:
1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git
3. Select GitHub → select this repo → branch: `main`
4. Build command: *(leave blank)*
5. Publish directory: *(leave blank or set to `/`)*
6. Click Deploy

Netlify will deploy automatically on every push to `main` from that point on.

---

## Waitlist form (Netlify Forms)

The email waitlist on `index.html` uses Netlify Forms. Submissions appear in your Netlify dashboard under **Forms → waitlist**. To enable email notifications:
1. Go to app.netlify.com → your site → Forms
2. Click on the `waitlist` form
3. Settings → Form notifications → Add email notification

---

## Project status

This is an interactive mockup / proof of concept built to illustrate the Blocks product vision for advisors and investors. Not connected to live market data.

---

## Contact

Built with [Claude](https://claude.ai) · © 2026 Blocks
