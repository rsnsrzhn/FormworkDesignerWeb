# React migration implementation plan

> **For agentic workers:** Use superpowers:executing-plans, inline execution authorized by the user's instruction to continue.

**Goal:** Deliver a Node/React landing site with guided tutorial, accurate product copy, Vercel setup and GitHub commits.
**Architecture:** Vite builds the interactive client and a build-time React renderer. Vercel Functions handle enquiries through configurable email delivery.
**Tech Stack:** Node 24, React, TypeScript, Vite, Manrope, Node tests, Playwright.
**Spec:** docs/superpowers/specs/2026-11-09-react-migration-design.md

## Global constraints
- Work ends at ~/Projects/FormworkDesignerWeb; preserve source snapshot in Git.
- No publication of Flutter, fake submission success, secrets in browser code, or unverified commercial claims.
- Russian copy; tutorial explicitly illustrative; no runtime .NET dependencies.

## Review focus
- Invalid/non-finite dimensions: bounded data, no broken SVG or inflated claims.
- Delivery unavailable or failing: explicit failure, retained fields, no success screen.
- Missing deployment domain: no invented canonical or example.com in public output.
- Direct route reload/unknown URL: prerendered content and genuine 404.
- Narrow screens/keyboard/reduced motion: readable content, aligned controls, accessible modal.

### Task 1: Root Node application and rendering
Files: package.json, tsconfig.json, vite.config.ts, index.html, scripts/build.mjs, src/App.tsx, src/main.tsx, src/entry-server.tsx, src/site.ts, vercel.json, .github/workflows/ci.yml.
Interfaces: App({path}), site metadata per path, build output dist/<route>/index.html.
- [x] Preserve baseline, relocate project, use isolated branch where available.
- [x] Migrate existing reusable assets/components, replace build and dev commands.
- [x] Remove .NET/deployment leftovers; install locked dependencies.
- [x] Verify typecheck/build and inspect generated HTML.

### Task 2: Guided tutorial and visual design
Files: src/demo/model.ts, src/components/Demo.tsx, src/components/FormworkScene.tsx, src/pages/Home.tsx, src/styles.css, tests/demo.test.ts, tests/browser.mjs.
Interfaces: calculateDemo({width,length,height}) -> geometry and illustrative panel segments/counts.
- [x] Write/run failing model tests for bounds, dimensions and counts.
- [x] Implement pure geometry calculation and pass tests.
- [x] Build tutorial stages, completion dialog and reset with keyboard focus management.
- [x] Apply Manrope and unified layout; update verified product content.
- [x] Browser-test walkthrough, CTA and mobile layout; inspect screenshots.

### Task 3: Vercel enquiries
Files: api/inquiries.ts, api/site-config.ts, server/inquiries.ts, src/pages/Contact.tsx, src/pages/Legal.tsx, src/lib/api.ts, tests/inquiries.test.ts, .env.example.
Interfaces: POST /api/inquiries -> 202 only after provider accepts; GET /api/site-config -> public config, never secrets.
- [x] Write/run failing request tests (method/body/origin/validation/provider failures).
- [x] Implement server validation and bounded HTTP delivery, pass tests.
- [x] Connect client, preserve input on error, no disabled-only dead end.
- [x] Exercise real local Node endpoints with synthetic provider injection in tests.

### Task 4: Documentation, production checks and Git
Files: README.md, docs/deployment-vercel.md, docs/verification.md, .gitignore.
- [x] Finalize actual env names/settings, free-address-first and purchased-domain instructions.
- [x] Run npm test, npm run build, browser verification and git diff --check.
- [x] Review changes, resolve important findings, commit and push without force.
- [x] Verify remote SHA and leave final checkout in requested directory.
