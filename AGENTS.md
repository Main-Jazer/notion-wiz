# Repository Guidelines

## Project Structure & Module Organization
The Vite + React client lives entirely under `src/`. Use `components/` for low-level UI and form parts, `widgets/` for the assembled Notion blocks, `contexts/` for shared state (theme, weather, layout), `hooks/` for reusable data flows, `utils/` for formatting/weather helpers, and `theme/` for Tailwind tokens. Static assets and HTML shells belong in `public/`. Built bundles land in `dist/` and should never be edited manually.

## Build, Test, and Development Commands
- `npm install` – install workspace dependencies (run after pulling new branches).
- `npm run dev` – start the Vite dev server on localhost with hot reload.
- `npm run build` – create the production bundle in `dist/`; required before deploys.
- `npm run preview` – serve the build output locally for smoke testing.
- `npm run lint` – run ESLint across the repo; fix issues before pushing.
- `node test-weather-sdk.js` – quick API smoke test against Open-Meteo.

## Coding Style & Naming Conventions
Follow the ESLint config in `eslint.config.js` and the Tailwind setup in `tailwind.config.js`. Use 2-space indentation, modern ESM syntax, and functional React components. Name components with `PascalCase` (e.g., `WidgetShell.jsx`), hooks with `useCamelCase`, and utility files with `camelCase`. Keep shared styles in CSS modules or Tailwind classes; avoid inline styles unless dynamic. Run `npm run lint -- --fix` before submitting.

## Testing Guidelines
Formal unit tests are still being introduced, so cover new logic with lightweight component stories or utility-level checks. Add smoke tests under `src/utils/__tests__/` using the Vite test runner when possible, and exercise integrations via `node test-weather-sdk.js`. Document manual QA steps in your PR if you touch network or layout code. Treat weather and token formatting helpers as high-risk and add assertions whenever you refactor them.

## Commit & Pull Request Guidelines
Follow the conventional style seen in `git log` (`feat:`, `fix:`, `docs:`, `chore:`). Each commit should scope to one concern and include any relevant issue ID in the message body. PRs must explain the motivation, list testing performed, and attach screenshots or Loom links for visual widget changes. Link to tracked bugs in `BUG_TRACKER.md` when applicable, and ensure `npm run lint` and a preview build have passed before requesting review.

## Security & Configuration Tips
Never hard-code API credentials; place any secrets in `.env.local` using the `VITE_*` prefix so Vite can expose them safely. Validate external data (e.g., weather responses) in `utils/` before rendering. Keep dependencies updated via `npm install` + `npm audit` when touching `package.json`, and prefer environment toggles over conditional imports for experimental widgets.
