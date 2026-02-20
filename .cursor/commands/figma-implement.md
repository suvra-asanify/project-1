# Figma Implementation Command

## Usage
```
/figma-implement [figma node/url/context]
```

## Purpose
Use this command when implementing UI from Figma using MCP tools in this project.

## Required Flow (Do Not Skip)
1. Run `get_design_context` first for the exact node(s).
2. If response is large/truncated, run `get_metadata`, identify required node(s), then rerun `get_design_context` only for those node(s).
3. Run `get_screenshot` for a visual reference of the target node variant.
4. Only after obtaining both `get_design_context` and `get_screenshot`, download/use assets and begin implementation.
5. Translate output (usually React + Tailwind) into this project's conventions, style system, and framework.
6. Validate against Figma for 1:1 look and behavior before marking done.

## Implementation Rules
- Treat Figma MCP output as design/behavior reference, not as final code style.
- Replace Tailwind utilities with project-preferred patterns and design-system tokens when applicable.
- Reuse existing components (buttons, inputs, typography, icon wrappers) instead of duplicating behavior.
- Use project color tokens, typography choices, and spacing conventions consistently.
- Respect existing routing, state management, and data-fetch patterns in this repo.
- Aim for 1:1 visual parity; if there is a conflict, prefer design-system tokens and make minimal spacing/size adjustments.
- Validate final UI behavior and visuals against the Figma screenshot before completion.

## Asset Rules (Critical)
- Use assets provided by Figma MCP payload/asset endpoint.
- If image/SVG source is `localhost`, use it directly.
- Do not add new icon packages.
- Do not create placeholders when a `localhost` source exists.

## Project Translation Checklist
- Framework: Vue 3 SFCs with Vuetify components.
- Styling: Vuetify + project tokens (`src/plugins/vuetify.js`, `src/plugins/helpers.js`, `src/main.css`, `src/base.sass`).
- Shared components first: `src/components/core/`, `src/components/base/`, and globally registered components in `src/components.js`.
- Keep route and module structure aligned with `src/router/routes.js` and feature folders in `src/components/`.
