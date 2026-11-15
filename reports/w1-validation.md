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
- Hosting: public GitHub Pages deployed successfully by Actions run 43773800553 after PR #2 merged. Live browser loaded 18,000 records; Adaptive filter showed 6,000 records across five runs.
- URL: https://jabrielabdillle.github.io/realtime-recommendation-pipeline/

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

## Final design-gate state

GATE: FAIL 47 (round 2 of 3). A repeat on unchanged files reused this result; it did not count as another round. No waivers were added. The following is the complete latest output; this is not a design-gate pass.

```text
gate: 47 FAIL open (page unchanged since the last run: results reused, not a new round)
  FAIL hero-fill        main#main > div.notice "Mock data workspace. The 18,000 database"  [1440, 390]
       the next section shows on the first screen: it starts at 211px on a 900px screen (the hero ends at 188px)
       fix: let the hero fill the first screen alone (min-height: 100svh, less above it): nothing of the next section on load
  FAIL flush            main#main > div.page-heading > div > p:nth-of-type(2) "See what the robot practiced, where  [1440]
       its last line sits 2px above the rule on top of div.notice
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            main#main > div.metrics > article:nth-of-type(1) > small "15 matching mock experiment runs  [1440]
       article:nth-of-type(1) and article:nth-of-type(2) run together: -83px between their content, on one ground
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            main#main > div.metrics > article:nth-of-type(2) > small "Across the selected mock episode  [1440]
       article:nth-of-type(2) and article:nth-of-type(3) run together: -83px between their content, on one ground
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            main#main > div.metrics > article:nth-of-type(3) > small "200-step timeout limit"  [1440, 390]
       article:nth-of-type(3) and article:nth-of-type(4) run together: -83px between their content, on one ground
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            div.analysis-grid > section.panel.learning > div.legend > span:nth-of-type(1) "Adaptive"  [1440]
       its last line sits -417px above the rule on top of section.panel.replay
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            section.panel:nth-of-type(1) > div.bucket-table > div.bucket-row:nth-of-type(4) > span.hea  [1440]
       its last line sits -234px above the rule on top of section.panel.protocol
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL nav              (the first screen)  [1440]
       no nav bar across the top of the first screen (a header with the brand, the section links and the main action)
       fix: make the nav one bar from the content's left edge to its right edge, with every link and action inside it
  FAIL text-only        main#main > section.panel.episode-panel "Recent episodes"  [1440, 390]
       the closing section is only text: no picture, icon, mock or effect in it
       fix: give the section a visual: a photograph that fits, the real icons, or a UI fragment on a ground
  FAIL button-styles    (the page)  [1440, 390]
       3 button styles on the page: soft, fill #2a2318 x1 ("Overview"); soft, fill #1a1611, outline #43392c x1 ("Export database"); soft, fill #c9a45a, outline #c9a45a x1 ("Watch robot replay")
       fix: one primary and one secondary button: one shape, one height per size, one label size
  FAIL cta              main#main > section.panel.episode-panel "Recent episodes"  [1440, 390]
       the last section before the footer ends with no button
       fix: add the action: a button in the hero, one on every priced item, one in the closing section
  FAIL heading-scale    main#main > div.metrics > article:nth-of-type(1) > strong "18,000"  [1440, 390]
       the figure "18,000" is set at 33px, larger than the h1 (30px) (and 1 more like it: "46.4%")
       fix: set figures below the h1: a stat reads as data, not as the headline
  FAIL section-gaps     main#main > div.lower-grid > section.panel.protocol / main#main > section.panel.episode-pa  [1440]
       102px between these sections, +146% against the median 42px of gaps at a change of ground
       fix: use one gap between sections (all within 25% of each other)
  FAIL links            div#app > aside.sidebar > a.brand "Adaptive Robotics lab"  [1440]
       "Adaptive Robotics lab" goes to #overview, which is not on this page
       fix: point every link at a real section, page or file
  FAIL section-tile     main#main > div.lower-grid "Scenario performance"  [1440, 390]
       the section is 271px tall (0.30 screens at 1440x900), shorter than the screen: its tile, held at the page's end (scroll 883px) shows 271px of it and 439px of the next section, its heading "Recent episodes" on screen
       fix: set every section after the hero to one screen or two (height: calc(var(--h,1) * 100vh)) and fit its content above --padb
  FAIL moment-none      (the page)  [1440]
       a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
       fix: deal one (moments.mjs pick --page software) and mount it in its own section
  FAIL hero-screen      main#main > div.page-heading "Warehouse navigationRobot training overv"  [1440]
       the hero ends at 188px on a 900px screen, 713px above the fold: it ends at the fold, 1px either way (SR-1)
       fix: make the hero exactly one screen (height: 100svh, its content fitted inside), never taller or shorter
  FAIL hero-screen      main#main > div.notice "Mock data workspace. The 18,000 database"  [1440]
       690px of the next section shows on the first screen (from 211px on a 900px screen): nothing below the hero shows at load (SR-1)
       fix: end the hero at the fold so nothing of the next section shows at load (hero height: 100svh)
  FAIL section-height   div#app > div.main-shell > footer "Adaptive Robotics Training Platform Simu"  [1440]
       the section is 39px tall (0 screens), 861px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-height   main#main > div.notice "Mock data workspace. The 18,000 database"  [1440]
       the section is 42px tall (0 screens), 858px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-air      main#main > div.notice / main#main > div.filters  [1440]
       37px of air between the content of these two sections: 128-480px (64-600px WARN) (every gap out of the band at 1440px, top to bottom: 37px after "Mock data workspace.", 46px after "CurriculumAll curric", 75px after "Trai
       fix: keep 128-480px of air between the content of neighbouring sections (112-420px on a phone): the sections' padding (--padt, --padb)
  FAIL section-air      main#main > div.filters / main#main > div.metrics  [1440]
       46px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
       fix: keep 128-480px of air between the content of neighbouring sections (112-420px on a phone): the sections' padding (--padt, --padb)
  FAIL section-air      main#main > div.notice "Mock data workspace. The 18,000 database"  [1440]
       the content fills 33.3% of the section's height (14 of 42px): 55% or more (40% WARN) (SR-3)
       fix: fill the section to 55%: more content, a picture or a background layer, or merge it into the section above as its last block
  FAIL one-section      main#main > div.page-heading > div > h1 "Robot training overview"  [1440]
       the screen at scroll 0px (stride 0) shows 136px of section 4 and the heading of section 1 whole and the content of 4 sections, over 24px each beside section 5: a screen shows one section (another may peek 8px, 24px WARN)
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-section      section.panel:nth-of-type(1) > div.panel-heading > div > h2 "Scenario performance"  [1440]
       the screen at scroll 211px (the top of section 2) shows 136px of section 4 and the heading of section 6 whole and the content of 4 sections, over 24px each beside section 5: a screen shows one section (another may peek 8
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL one-heading      section.panel.replay > div.panel-heading > div > h2 "Policy replay"  [1440]
       the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)
       fix: give each section one h2, first in its .wrap, and the hero only its h1
  FAIL one-heading      main#main > div.lower-grid > section.panel.protocol > h2 "Two loops. One learner."  [1440]
       the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)
       fix: give each section one h2, first in its .wrap, and the hero only its h1
  FAIL one-heading      section.panel:nth-of-type(1) > div.panel-heading > div > h2 "Scenario performance"  [1440]
       headings of two sections show whole on one screen at 15 of 18 scroll positions (83.3%; at scroll 150, 200, 250, 300px), here with "Learning curves": at most 3% on a desktop (SR-5)
       fix: make the sections one screen tall so their headings sit a screen apart and two never share one
  FAIL container-edges  div#app > div.main-shell > header.topbar "Workspace / Training overview Browser SQ"  [1440]
       the nav's content runs 270px from the left and 36px from the right (read from its outermost blocks: no .wrap): 270 and 36px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px either w
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  main#main > div.page-heading "Warehouse navigationRobot training overv"  [1440]
       the content of section 1 runs 270px from the left and 36px from the right (read from its outermost blocks: no .wrap): 270 and 36px are not one margin; the margin is 64-120px at 1440px (one container, equal margins, 2px e
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  a.skip "Skip to training data"  [1440]
       a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div#app "AdaptiveRobotics lab RNavigation researc"  [1440]
       a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (and 8 more like it: "Warehouse navigationRobo", "Mock data workspace. The", "CurriculumAll curriculaA") (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div#app > div.main-shell > footer > span "Simulated navigation · No physical robot"  [1440]
       1 text block starts on a left line at x 1188, 918px from the container's left: text starts on the container's left, or on one split line (x 753, 849, 946) (SR-6)
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL container-edges  section.panel.replay > div.panel-heading > div > h2 "Policy replay"  [1440]
       the h2 starts 722px right of the container's left: every h1 and h2 starts on it, 2px either way (and 6 more like it: "Two loops. One learner.", x 569, x 294) (SR-6)
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL container-edges  div.analysis-grid > section.panel.learning > div.chart-wrap > span.axis-label "Episodes pe  [1440]
       "Episodes per run" is set centred across 630px, over half the 1134px container: text that wide is set left (SR-6)
       fix: set the text left (text-align: start)
  FAIL container-edges  main#main > div.analysis-grid > section.panel.learning "Learning curvesMock completion rat  [1440]
       a box over half the container wide runs 270-946px, not on the container's lines at 270-1404px (and 1 more like it: "Scenario performanceMock") (SR-6)
       fix: run the picture or box from the container's left line to its right line, or put it in a row or a split
  FAIL row-lines        div.lower-grid > section.panel:nth-of-type(1) > div.bucket-table > div.bucket-header "Scen  [1440]
       a row of 4 items: its first item starts at 294px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (SR-7)
       fix: start the row's first item on the container's left line and end its last on the right line, every item one height
  FAIL row-lines        div.lower-grid > section.panel:nth-of-type(1) > div.bucket-table > div.bucket-row:nth-of-t  [1440]
       a row of 3 items: its first item starts at 520px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (SR-7)
       fix: start the row's first item on the container's left line and end its last on the right line, every item one height
  FAIL row-lines        div.lower-grid > section.panel:nth-of-type(1) > div.bucket-table > div.bucket-row:nth-of-t  [1440]
       a row of 3 items: its first item starts at 520px, the container's left line at 270px; its last item ends at 922px, the container's right line at 1404px (2px either way) (and 1 more like it: "Cluttered aisles50%45%43") (S
       fix: start the row's first item on the container's left line and end its last on the right line, every item one height
  FAIL flush            button#export "Export database"  [390]
       its button sits 0px above the lower edge of div.page-heading, where the ground changes to div.notice
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL flush            select#method "All curricula Adaptive Uniform Fixed"  [390]
       its last line sits 0px above the lower edge of div.filters, where the ground changes to article:nth-of-type(1)
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL cut-text         tbody > tr:nth-of-type(2) > td:nth-of-type(4) > span.result.success "Completed"  [390]
       cut 8px at the right by the overflow of main#main > section.panel.episode-panel (and 2 more like it: "Completed", "Completed")
       fix: give the text room: no overflow clipping a line, no line past its box
  FAIL centre-axis      section.panel:nth-of-type(1) > div.bucket-table > div.bucket-header > span:nth-of-type(2)   [390]
       centred text 20px left of the middle of its page (175px against 195px)
       fix: centre the block on its container (margin-inline: auto), or set it on the left grid
  FAIL centre-axis      section.panel:nth-of-type(1) > div.bucket-table > div.bucket-header > span:nth-of-type(3)   [390]
       centred text 54px right of the middle of its page (249px against 195px)
       fix: centre the block on its container (margin-inline: auto), or set it on the left grid
  FAIL centre-axis      section.panel:nth-of-type(1) > div.bucket-table > div.bucket-header > span:nth-of-type(4)   [390]
       centred text 127px right of the middle of its page (322px against 195px)
       fix: centre the block on its container (margin-inline: auto), or set it on the left grid
  FAIL section-gaps     main#main > div.lower-grid > section.panel:nth-of-type(1) / main#main > div.lower-grid > s  [390]
       73px between these sections, +85% against the median 40px of gaps at a change of ground
       fix: use one gap between sections (all within 25% of each other)
  FAIL container        page  [1440, 390]
       no .wrap
       fix: put the content in one .wrap
  35 WARN (not blocking), first: flush main#main > div.metrics > article:nth-of; flush main#main > div.metrics > article:nth-of; flush section.panel.learning > div.panel-headi; flush section.panel:nth-of-type(1) > div.panel; flush section.panel.episode-panel > div.panel-
A FAIL you judge false: add {"check": "<id>", "target": "<its where, enough to name that one finding>", "reason": "<why, 12+ characters>"} to .taste-skill/waivers.json (one finding each, 5 at most, never for kit-edited or checker-gaming); it goes in your report. Never edit the kit's files or hide the page from the checker.
GATE: FAIL 47 (round 2 of 3)

```
