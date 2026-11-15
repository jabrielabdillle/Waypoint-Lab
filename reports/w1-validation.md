# W1 dashboard validation

- Production build: Vite 6.4.6, ES2022 target, relative asset URLs.
- Browser checks: seven passing Playwright tests against the built bundle using Chrome on macOS arm64.
- Viewports: 1440, 1024, 768, 390 and 320 pixels; no document-level horizontal overflow. Tables intentionally scroll within their container.
- Functional coverage: SQLite filters, pagination, literal SQL-injection search handling, episode dialog/Escape, CSV download, actual PPO trace playback/reset, evidence disclosure.
- Database: 18,000 deterministic mock rows, 15 runs, three curricula, three scenario families, three difficulties. Uses prepared statements and browser-only storage. Data is regenerated on reload.
- Dependency audit: zero vulnerabilities after upgrading Vite from 6.4.1 to 6.4.6.
- Secret-pattern scan: no matches across project text files outside dependencies and generated artifacts. Commit history contains project context and M0a source/evidence only.
- Visual inspection: desktop and mobile screenshots reviewed; fixed a missing navigation icon and filtered-run-count label.
- Scientific limitation: mock learning curves are not experiment results. The replay comes from M0a's single-layout feasibility check.
- Hosting: workflow prepared; publication not yet verified at report time.

## Design review

| Before | After | Why |
| --- | --- | --- |
| Missing overview icon at mobile width | Rendered LayoutDashboard icon | Keeps navigation recognizable when text is hidden |
| Fixed 15-run label under filters | SQL count of distinct matching runs | Keeps the summary truthful |
| Inherited development target rejected top-level await | Explicit ES2022 build target | Supports async WebAssembly initialization in modern browsers |

Taste Skill supplied the palette/type direction; Emil Kowalski's skill informed restrained press/hover feedback, explicit transitions, focus states and reduced-motion support. Marketing-only full-screen section rules are not applied to the research application's working dashboard. Playwright is the test package, not an installed connector.
