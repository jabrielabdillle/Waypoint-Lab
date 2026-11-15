# Free GitHub Pages deployment

The user selected GitHub Pages and authorized public repository visibility. No paid services, credit-card enrollment or usage-based database are required.

## What runs where

| Component | Runtime |
|---|---|
| Dashboard | GitHub Pages static files |
| SQLite, 18,000 mock episode records | Visitor's browser, sql.js/WebAssembly |
| Fixed-task policy replay | Recorded positions from the measured M0a run |
| PPO training | Local Python process |
| Kafka/Flink/Feast integration | Planned local services; not hosted by Pages |

The database is regenerated deterministically on page load, can be filtered with parameterized SQL, and can be downloaded as SQLite or CSV. It is not a shared writable cloud database. No mock records constitute learning evidence. No backend credentials are embedded in the browser.

## Build and test

```sh
cd web
npm ci
npx playwright install chromium
npm test
npm run preview
```

Playwright uses installed Google Chrome on macOS by default and its bundled Chromium on Linux. CHROME_PATH can override the executable. Tests run the production build.

## Publish

Set Settings > Pages > Source to GitHub Actions. The web workflow tests the production bundle on pull requests, then uploads and deploys it after merge to main. Relative asset URLs support the repository subpath. No custom domain is needed.

Expected URL: https://jabrielabdillle.github.io/realtime-recommendation-pipeline/

Always verify the deployment job and the live URL before claiming publication. GitHub Pages and Actions usage limits still apply; do not enable paid upgrades or billing to bypass them.

## Frontend design provenance

Used Leonxlnx/taste-skill (design-taste-frontend) and emilkowalski/skills (emil-design-eng). Taste's dealer selected warm-black-gold and Instrument Sans/DM Mono. Application controls, dense data tables and honest mock-data labeling take precedence over marketing-page-only rules such as full-screen promotional sections. No stock photography or invented testimonials are used.

The requested Playwright plugin was absent from the connected plugin directory. The implementation uses the official @playwright/test package for functional and responsive browser checks. This is not a claim that a Playwright connector was installed.
