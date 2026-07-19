---
name: create-ads-component
description: Create or modify a UI component in the Automate Design System (ADS). Use whenever adding/changing anything under src/components/ — components are built on MUI v7 but must be expressed in ADS with theme tokens, a Storybook story, a barrel export, and a DESIGN.md contract entry.
---

# Create an ADS component

ADS (the Automate Design System) is the **system of record**, documented in
`DESIGN.md`. MUI v7 is only the implementation substrate. A component belongs in
ADS when it adds meaning/behavior beyond a raw MUI primitive.

## Before writing code
1. **Read `DESIGN.md`** — the tokens (color/typography/spacing/radius/elevation),
   the component contract rules, and Appendix B (existing component contracts).
2. **Read 2–3 existing components** in `src/components/` (e.g. `AppButton`,
   `StatCard`, `DataTable`) and copy their structure, prop style, and JSDoc tone.

## Files (one folder per component)
Create `src/components/<Name>/`:
- `<Name>.tsx` — the component
- `<Name>.stories.tsx` — Storybook story (`title: 'Components/<Name>'`, `tags: ['autodocs']`, multiple named stories)
- `index.ts` — barrel: `export { <Name>, default } from './<Name>'; export type { <Name>Props } from './<Name>';`

Then add the component to the root barrel `src/components/index.ts`.

## Rules (non-negotiable)
- **Wrap the MUI primitive, expose an ADS contract.** Props are in product terms;
  the MUI wrapping is invisible to consumers.
- **Token-driven styling only.** Use the theme for everything: `theme.palette.*`
  (or `sx` string tokens like `color: 'primary.main'`, `'text.secondary'`,
  `'divider'`), `theme.spacing()`, `theme.shape.borderRadius`, typography variants.
  **No hard-coded hex colors or pixel margins.**
- **Define states**: default, hover, focus (visible ring), disabled — plus
  `loading` / `empty` / `error` where they apply. The functionality must actually
  work, not be a static shell.
- **Accessibility**: `aria-label` on icon-only controls, labelled inputs,
  keyboard operable, focus visible.
- Support controlled **and** uncontrolled where the component holds input state.

## Document it
Add the component's contract to **`DESIGN.md` → Appendix B**: a props table
(type / default, mark **required**), supporting types, its states, and the ADS
tokens it consumes. Also add a one-line row to §4.1.

## Verify
Run `npm run build` (runs `tsc -b` + `vite build`) and ensure it passes before
considering the work done. Check the Storybook a11y panel if running.

## Naming
Folder + component are PascalCase (`DateRangePicker`). Story title is
`Components/<Name>`.
