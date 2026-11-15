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

## Taste gate outcome

GATE: FAIL 49 (round 1 of 3). This is not represented as a passing design gate. The slash contrast and select touch-target findings were corrected after this run. Remaining findings are recorded below. Full-screen hero/section rules, promotional CTA expectations, centered-page navigation and captions conflict with the working research dashboard layout and explicit mock-data disclosure; these have not been hidden from the checker or silently waived. Playwright independently verified controls and bounded table scrolling.

- hero-fill: the next section shows on the first screen: it starts at 211px on a 900px screen (the hero ends at 188px)
- flush: its last line sits 2px above the rule on top of div.notice
- flush: article:nth-of-type(1) and article:nth-of-type(2) run together: -83px between their content, on one ground
- flush: article:nth-of-type(2) and article:nth-of-type(3) run together: -83px between their content, on one ground
- flush: article:nth-of-type(3) and article:nth-of-type(4) run together: -83px between their content, on one ground
- flush: its last line sits -417px above the rule on top of section.panel.replay
- flush: its last line sits -234px above the rule on top of section.panel.protocol
- nav: no nav bar across the top of the first screen (a header with the brand, the section links and the main action)
- text-only: the closing section is only text: no picture, icon, mock or effect in it
- button-styles: 3 button styles on one screen: soft, fill #2a2318 ("Overview"); soft, fill #1a1611, outline #43392c ("Export database"); soft, fill #c9a45a, outline #c9a45a ("Watch robot replay"); the odd one out: "Watch robot replay"
- button-styles: 3 button styles on the page: soft, fill #2a2318 x1 ("Overview"); soft, fill #1a1611, outline #43392c x1 ("Export database"); soft, fill #c9a45a, outline #c9a45a x1 ("Watch robot replay")
- cta: the last section before the footer ends with no button
- heading-scale: the figure "18,000" is set at 33px, larger than the h1 (30px) (and 1 more like it: "46.4%")
- text-contrast: a caption, label or muted line in #645b4e on #0c0a08 reads 2.96:1 (needs 4.5:1)
- section-gaps: 102px between these sections, +146% against the median 42px of gaps at a change of ground
- links: "Adaptive Robotics lab" goes to #overview, which is not on this page
- section-tile: the section is 271px tall (0.30 screens at 1440x900), shorter than the screen: its tile, held at the page's end (scroll 878px) shows 271px of it and 439px of the next section, its heading "Recent episodes" on screen
- moment-none: a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
- hero-screen: the hero ends at 188px on a 900px screen, 713px above the fold: it ends at the fold, 1px either way (SR-1)
- hero-screen: 690px of the next section shows on the first screen (from 211px on a 900px screen): nothing below the hero shows at load (SR-1)
- section-height: the section is 39px tall (0 screens), 861px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- section-height: the section is 42px tall (0 screens), 858px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- section-air: 37px of air between the content of these two sections: 128-480px (64-600px WARN) (every gap out of the band at 1440px, top to bottom: 37px after "Mock data workspace.", 46px after "CurriculumAll curric", 75px after "Training episodes18,", 67px after "Learning curvesMock ", 81px after "Scenario performance") (SR-3)
- section-air: 46px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
- section-air: the content fills 33.3% of the section's height (14 of 42px): 55% or more (40% WARN) (SR-3)
- one-section: the screen at scroll 0px (stride 0) shows 136px of section 4 and the heading of section 1 whole and the content of 4 sections, over 24px each beside section 5: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- one-section: the screen at scroll 211px (the top of section 2) shows 136px of section 4 and the heading of section 6 whole and the content of 4 sections, over 24px each beside section 5: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- one-heading: the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)
- one-heading: the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)
- one-heading: headings of two sections show whole on one screen at 15 of 18 scroll positions (83.3%; at scroll 150, 200, 250, 300px), here with "Learning curves": at most 3% on a desktop (SR-5)
- container-edges: the nav's content runs 270px from the left and 36px from the right (read from its outermost blocks: no .wrap): 270 and 36px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
- container-edges: the content of section 1 runs 270px from the left and 36px from the right (read from its outermost blocks: no .wrap): 270 and 36px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 6 more like it: "CurriculumAll curriculaA", "Training episodes18,0001", "Learning curvesMock comp") (SR-6)
- container-edges: a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- container-edges: a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (and 8 more like it: "Warehouse navigationRobo", "Mock data workspace. The", "CurriculumAll curriculaA") (SR-6)
- container-edges: 1 text block starts on a left line at x 1188, 918px from the container's left: text starts on the container's left, or on one split line (x 753, 849, 946) (SR-6)
- container-edges: the h2 starts 722px right of the container's left: every h1 and h2 starts on it, 2px either way (and 6 more like it: "Two loops. One learner.", x 569, x 294) (SR-6)
- container-edges: "Episodes per run" is set centred across 630px, over half the 1134px container: text that wide is set left (SR-6)
- container-edges: a box over half the container wide runs 270-946px, not on the container's lines at 270-1404px (and 1 more like it: "Scenario performanceMock") (SR-6)
- row-lines: a row of 4 items: its first item starts at 294px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (SR-7)
- row-lines: a row of 3 items: its first item starts at 520px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (SR-7)
- row-lines: a row of 3 items: its first item starts at 520px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (and 1 more like it: "Cluttered aisles50%45%43") (SR-7)
- flush: its button sits 0px above the lower edge of div.page-heading, where the ground changes to div.notice
- flush: its last line sits 0px above the lower edge of div.filters, where the ground changes to article:nth-of-type(1)
- cut-text: cut 8px at the right by the overflow of main#main > section.panel.episode-panel (and 2 more like it: "Completed", "Completed")
- centre-axis: centred text 20px left of the middle of its page (175px against 195px)
- centre-axis: centred text 54px right of the middle of its page (249px against 195px)
- centre-axis: centred text 127px right of the middle of its page (322px against 195px)
- section-gaps: 73px between these sections, +85% against the median 40px of gaps at a change of ground
- container: no .wrap

CI initially failed before tests because ubuntu-latest resolved to Ubuntu 26.04, unsupported by the pinned Playwright release. The workflow now explicitly uses Ubuntu 24.04.
