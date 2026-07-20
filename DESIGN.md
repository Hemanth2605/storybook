# Automate Design System (ADS)

ADS is **our own** design system. It defines the visual language, tokens, and
component contracts for the product. It is the **source of truth** — not a
description of any UI library.

Material UI happens to be the current **implementation substrate**: our tokens
are projected onto a thin MUI theme, and our components are realized by
composing MUI primitives. But the system is ours. If we ever swapped the
substrate, this document — and the public component contracts — would not
change. MUI details are confined to the [Implementation appendix](#appendix-a--implementation-substrate-mui).

> **Golden rule:** consumers use **ADS tokens and ADS components**, never raw
> substrate values or raw substrate components. `theme.palette.primary` is an
> implementation detail; `color.brand` is the token you reference.

---

## 1. What ADS is (and is not)

- **ADS is** a named set of tokens, a component library with defined contracts,
  and the rules that govern them.
- **ADS is not** the MUI theme. The MUI theme is generated *from* ADS to satisfy
  it. Documenting "this equals `theme.spacing(3)`" would be describing the
  substrate — we describe **our** `space-6` instead.

### When to create a new ADS component

Every request for a component runs through this gate:

1. **Does the substrate already do it fully, unmodified?** If a raw MUI control
   satisfies the need with zero added meaning or behavior, we don't create an
   ADS component — we just use the substrate internally.
2. **Does it exceed the substrate?** If it adds product meaning, composed
   behavior, opinionated defaults, or new states (loading, empty, status,
   presence, multi-step flow…), it becomes a **first-class ADS component**:
   built on top of the substrate, given an ADS contract, and documented here.

> In short: **ADS owns everything that goes beyond the plain substrate.** That
> layer is what we maintain in this file — never the substrate's own catalog.

---

## 2. Design principles

1. **Own the language.** Reference ADS tokens/components only; the substrate is
   invisible to consumers.
2. **Extend, don't restate.** We document the value we add on top of the
   substrate, not the substrate's built-in behavior.
3. **Token-first.** No hard-coded colors or pixel gaps in components — always a
   token.
4. **Accessible by default.** AA contrast, visible focus, keyboard operable.
5. **Calm and content-first.** Soft neutrals, one confident brand color,
   restrained elevation.

---

## 3. Tokens

Tokens are the atomic, named decisions of ADS. They come in two layers:

- **Primitives** — the raw scale values (e.g. `brand-600 = #4f46e5`).
- **Semantic tokens** — role-based aliases that components consume
  (e.g. `color.action.primary → brand-600`). Components reference **semantic
  tokens only**, so we can re-map primitives without touching components.

### 3.1 Color primitives

| Primitive | Hex |
| --- | --- |
| `brand-600` | `#4f46e5` |
| `brand-700` | `#4338ca` |
| `accent-600` | `#db2777` |
| `positive-600` | `#16a34a` |
| `caution-600` | `#d97706` |
| `critical-600` | `#dc2626` |
| `info-600` | `#0284c7` |
| `neutral-0` | `#ffffff` |
| `neutral-50` | `#f8fafc` |
| `neutral-100` | `#f1f5f9` |
| `neutral-200` | `#e2e8f0` |
| `neutral-400` | `#94a3b8` |
| `neutral-500` | `#64748b` |
| `neutral-600` | `#475569` |
| `neutral-900` | `#0f172a` |

### 3.2 Semantic color tokens

| Semantic token | → Primitive | Role |
| --- | --- | --- |
| `color.action.primary` | `brand-600` | Primary actions, links, focus ring |
| `color.action.primaryHover` | `brand-700` | Primary hover/pressed |
| `color.accent` | `accent-600` | Secondary emphasis |
| `color.status.positive` | `positive-600` | Success, **Approve** |
| `color.status.caution` | `caution-600` | Warning, pending |
| `color.status.critical` | `critical-600` | Error, destructive, **Reject** |
| `color.status.info` | `info-600` | Informational |
| `color.surface` | `neutral-0` | Cards, panels |
| `color.surface.sunken` | `neutral-50` | App background, subtle fills |
| `color.surface.hover` | `neutral-100` | Hover fills, table headers |
| `color.border` | `neutral-200` | Borders, dividers |
| `color.text.primary` | `neutral-900` | Primary text, headings |
| `color.text.secondary` | `neutral-500` | Secondary/helper text |
| `color.text.disabled` | `neutral-400` | Disabled text, placeholders |
| `color.text.onBrand` | `neutral-0` | Text on brand/status fills |

**Rules**
- One `color.action.primary` emphasis per view; everything else is quieter.
- Status colors carry meaning — never decorative.
- Any text/background pair must pass AA (4.5:1 body, 3:1 large/UI).

### 3.3 Typography tokens

Type family: **Inter** (brand), falling back to a neutral sans stack.

| Token | Size | Weight | Line height | Role |
| --- | --- | --- | --- | --- |
| `text.display` | 32px | 700 | 1.2 | Page titles |
| `text.title` | 24px | 700 | 1.25 | Section titles |
| `text.subtitle` | 20px | 700 | 1.3 | Sub-sections |
| `text.metric` | 18px | 700 | 1.35 | Big numbers (stat cards) |
| `text.heading` | 16px | 600 | 1.4 | Dialog / step titles |
| `text.body` | 16px | 400 | 1.5 | Default copy |
| `text.bodySm` | 14px | 400 | 1.43 | Secondary copy |
| `text.label` | 14px | 600 | 1.4 | Buttons, emphasized labels |
| `text.caption` | 12px | 400 | 1.4 | Metadata, field labels |

**Rules:** headings 700, labels/buttons 600, body 400. Buttons are **never**
uppercased. Target ~66 characters per line for body copy.

### 3.4 Spacing tokens

A 4px-based scale. Components reference the **token name**, not pixels.

| Token | Pixels | Role |
| --- | --- | --- |
| `space-1` | 4px | Icon ↔ label, tight stacks |
| `space-2` | 8px | Compact gaps |
| `space-3` | 12px | Control inner padding |
| `space-4` | 16px | Default padding, grid gutters |
| `space-6` | 24px | Card padding, section spacing |
| `space-8` | 32px | Between major sections |
| `space-12` | 48px | Empty-state vertical padding |

### 3.5 Radius tokens

| Token | Radius | Role |
| --- | --- | --- |
| `radius-sm` | 6px | Chips, small controls |
| `radius-md` | 10px | **Default** — cards, inputs, buttons |
| `radius-lg` | 12px | Dialogs, large surfaces |
| `radius-pill` | 999px | Avatars, dots, pills |

### 3.6 Elevation tokens

ADS favors **borders over shadows**.

| Token | Role | Value |
| --- | --- | --- |
| `elevation-flat` | Cards, panels (default) | no shadow + `1px` `color.border` |
| `elevation-raised` | Hover lift, popovers | soft shadow |
| `elevation-overlay` | Menus, dropdowns | medium shadow |
| `elevation-modal` | Dialogs | strong shadow |

### 3.7 Motion tokens

| Token | Duration | Easing | Role |
| --- | --- | --- | --- |
| `motion-fast` | 150ms | ease-out | Hover, focus |
| `motion-standard` | 225ms | `cubic-bezier(0.4,0,0.2,1)` | Collapse/expand |
| `motion-emphasized` | 300ms | ease-in-out | Dialog enter/leave |

Honor `prefers-reduced-motion` — drop non-essential animation when set.

### 3.8 Breakpoint tokens

| Token | Min width | Target |
| --- | --- | --- |
| `bp-xs` | 0 | Phones |
| `bp-sm` | 600px | Large phones |
| `bp-md` | 900px | Tablets |
| `bp-lg` | 1200px | Laptops (content cap) |
| `bp-xl` | 1536px | Large desktops |

---

## 4. Component contracts

ADS components are the vocabulary consumers build with. Each one:

- exposes an **ADS contract** (props expressed in product terms, not substrate
  terms);
- consumes **semantic tokens** only;
- defines its **states**: default, hover, focus (visible ring), active,
  disabled, and — where relevant — loading, empty, error;
- lives in `src/components/<Name>/` with the component, a Storybook story, and a
  barrel export.

### 4.1 Current ADS components (what each adds beyond the substrate)

| ADS component | Adds beyond plain substrate |
| --- | --- |
| `AppButton` | Inline loading state (`loading`, `loadingText`); opinionated primary defaults |
| `StatCard` | Metric + directional trend semantics |
| `SearchField` | Search affordance, clear control, debounced `onSearch` |
| `ConfirmDialog` | Guarded confirm/cancel contract with destructive + loading modes |
| `PageHeader` | Title + subtitle + breadcrumbs + actions as one unit |
| `StatusChip` | Maps a semantic status → consistent label, color, and dot |
| `UserAvatar` | Initials fallback, deterministic color, presence badge |
| `AlertBanner` | Dismissible messaging with animation, title, and action slot |
| `EmptyState` | The "no data" pattern: icon + message + call to action |
| `DataTable` | Type-safe columns, click-to-sort, and an empty state |
| `ComponentRequestWizard` | Multi-step intake flow that emails a request with Approve/Reject actions |
| `RatingStars` | Star rating input: field label, numeric readout, half-star precision, plus loading/empty/error states |
| `Slider` | Range slider that surfaces the percentage **on the thumb (circle)** on hover/focus/drag; adds a field label, percentage readout, and loading/empty/error states |
| `Switch` | On/off toggle whose **state text flips with the toggle** (off text by default, on text once clicked); adds a field label, live state readout, and loading/error states |

Each is documented in Storybook; ADS treats Storybook as the living component
reference.

### 4.2 Button emphasis (ADS contract)

| Emphasis | Meaning |
| --- | --- |
| Primary | The single main action per view (`color.action.primary`, filled) |
| Secondary | Supporting actions (outlined) |
| Tertiary | Low-emphasis / inline (text) |
| Destructive | Delete / reject (`color.status.critical`) |

---

## 5. Accessibility

- Contrast: body ≥ 4.5:1, large text & UI ≥ 3:1.
- Visible focus ring (`color.action.primary`) on every interactive element.
- Icon-only controls carry an accessible label; inputs are labelled.
- Dialogs trap focus and close on `Esc`; all flows are keyboard operable.
- Storybook's a11y checks run per story.

---

## 6. Governance & workflow

1. **This file is the source of truth.** Change a token here first.
2. **Project the tokens onto the substrate.** Update the generated theme so the
   substrate reflects the ADS token (see appendix).
3. **New component?** Run the [creation gate](#when-to-create-a-new-ads-component).
   If it exceeds the substrate, add it under `src/components/`, give it an ADS
   contract + story, and list it in §4.1.
4. **Verify** with a build and the Storybook a11y panel.
5. Speak in **ADS terms** (`color.action.primary`, `space-6`, `AppButton`) — not
   substrate terms — in code reviews and docs.

---

## Appendix A — Implementation substrate (MUI)

This appendix is the **only** place the substrate appears. It shows how ADS
tokens are currently realized; consumers should never need it.

- ADS tokens are projected onto a MUI theme in
  [`src/theme/theme.ts`](src/theme/theme.ts) (`createTheme`).
- Current projection:
  - `color.action.primary` → `palette.primary.main`
  - `color.status.positive|caution|critical|info` → `palette.success|warning|error|info`
  - `color.surface*`, `color.text*` → `palette.background.*`, `palette.text.*`
  - `space-N` → `theme.spacing()` (8px base; `space-6` ≈ `spacing(3)`)
  - `radius-md` → `theme.shape.borderRadius`
  - `text.*` → `theme.typography.*` variants
  - `elevation-flat` → `MuiCard` override (elevation 0 + `1px` border)
- ADS components wrap MUI primitives (Button, Card, Dialog, Table, Stepper, …)
  but expose ADS contracts, so the wrapping is invisible to consumers.

If the substrate changed, only this appendix and `theme.ts` would need to — the
ADS tokens, contracts, and this document's other sections would stay the same.

---

## Appendix B — Component reference (contracts)

The full contract for every component currently in `src/components/`. Props
marked **required** have no default. Types shown in substrate terms (`ReactNode`,
`ButtonProps`, …) are the developer-facing API; the visual result is governed by
ADS tokens. Storybook is the live, interactive version of this reference.

### AppButton
Button with an inline loading state. Extends all substrate `ButtonProps`.

| Prop | Type | Default |
| --- | --- | --- |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | — (falls back to `children`) |
| `variant` | `'contained' \| 'outlined' \| 'text'` | `'contained'` |
| `color` | palette color | `'primary'` |
| …`ButtonProps` | — | — |

**States:** default, hover, focus, active, disabled, **loading** (spinner +
disabled). **Tokens:** `color.action.primary`, `text.label`, `radius-md`.

### StatCard
Metric card with an optional directional trend.

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | **required** |
| `value` | `ReactNode` | **required** |
| `icon` | `ReactNode` | — |
| `changePercent` | `number` | — (hidden if omitted) |
| `changeLabel` | `string` | `'vs last period'` |

**States:** with/without icon, positive trend, negative trend, no trend.
**Tokens:** `color.surface`, `color.status.positive`/`critical`, `text.metric`,
`elevation-flat`.

### SearchField
Search input with icon, clear button, and debounced change. Extends
`TextFieldProps` (minus `onChange`).

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string` | — (uncontrolled if omitted) |
| `onSearch` | `(value: string) => void` | — |
| `debounceMs` | `number` | `300` |
| `placeholder` | `string` | `'Search…'` |
| …`TextFieldProps` | — | — |

**States:** empty (no clear button), filled (clear button shown), focus,
disabled. **Tokens:** `color.border`, `color.text.disabled`, `radius-md`.

### ConfirmDialog
Guarded confirm/cancel dialog.

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | **required** |
| `title` | `string` | **required** |
| `description` | `ReactNode` | — |
| `confirmText` | `string` | `'Confirm'` |
| `cancelText` | `string` | `'Cancel'` |
| `destructive` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `onConfirm` | `() => void` | **required** |
| `onCancel` | `() => void` | **required** |

**States:** neutral, destructive (critical confirm), loading (blocks close).
**Tokens:** `color.status.critical`, `elevation-modal`, `radius-lg`.

### PageHeader
Page title unit: breadcrumbs + title + subtitle + actions.

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | **required** |
| `subtitle` | `string` | — |
| `breadcrumbs` | `Crumb[]` | — |
| `actions` | `ReactNode` | — |

`Crumb = { label: string; href?: string }` (last crumb renders as current page).
**Tokens:** `text.display`, `text.bodySm`, `color.text.secondary`, `space-6`.

### StatusChip
Maps a semantic status to a consistent label/color/dot. Extends `ChipProps`
(minus `color`, `label`).

| Prop | Type | Default |
| --- | --- | --- |
| `status` | `StatusKind` | **required** |
| `label` | `string` | — (status default) |
| `showDot` | `boolean` | `true` |
| `size` | `'small' \| 'medium'` | `'small'` |
| `variant` | `'filled' \| 'outlined'` | `'outlined'` |

`StatusKind = 'active' \| 'pending' \| 'inactive' \| 'error' \| 'success' \| 'warning'`.
**Tokens:** `color.status.*`, `radius-pill`, `text.caption`.

### UserAvatar
Avatar with initials fallback and presence badge. Extends `AvatarProps` (minus
`children`).

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | **required** |
| `src` | `string` | — (initials if omitted) |
| `online` | `boolean` | — (no badge if omitted) |
| `tooltip` | `boolean` | `false` |

**States:** image, initials (deterministic color), online, offline, tooltip.
**Tokens:** `color.status.positive` (online dot), `radius-pill`, `text.label`.

### AlertBanner
Dismissible message with title and action.

| Prop | Type | Default |
| --- | --- | --- |
| `severity` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` |
| `title` | `string` | — |
| `children` | `ReactNode` | **required** |
| `dismissible` | `boolean` | `false` |
| `action` | `ReactNode` | — |
| `onClose` | `() => void` | — |

**States:** each severity, dismissible (collapse animation), with action.
**Tokens:** `color.status.*`, `motion-standard`, `radius-md`.

### EmptyState
"No data" pattern: icon + message + call to action.

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | **required** |
| `description` | `string` | — |
| `icon` | `ReactNode` | inbox icon |
| `action` | `ReactNode` | — |

**Tokens:** `color.surface.hover` (icon well), `color.text.secondary`,
`space-12`, `radius-pill`.

### DataTable
Generic, type-safe, client-sorted table. Generic over `Row`.

| Prop | Type | Default |
| --- | --- | --- |
| `columns` | `Column<Row>[]` | **required** |
| `rows` | `Row[]` | **required** |
| `getRowId` | `(row: Row) => string \| number` | **required** |
| `onRowClick` | `(row: Row) => void` | — |
| `emptyMessage` | `string` | `'No data to display.'` |
| `dense` | `boolean` | `false` |

`Column<Row> = { id: keyof Row & string; label: string; align?: 'left' \| 'right' \| 'center'; render?: (row: Row) => ReactNode; sortable?: boolean /* default true */ }`.
**States:** sorted asc/desc, hover row (when clickable), empty, dense.
**Tokens:** `color.surface.hover` (header), `color.border`, `text.label`.

### ComponentRequestWizard
Multi-step intake flow that emails a component request with Approve/Reject
actions (via the `server/` backend).

| Prop | Type | Default |
| --- | --- | --- |
| `apiUrl` | `string` | `'/api/request'` |
| `recipientEmail` | `string` | `'hemanth.mareedu8@gmail.com'` |
| `onSubmit` | `(request, result: SubmitResult) => void` | — |

`SubmitResult = { ok: boolean; id?: string; to?: string; previewUrl?: string }`.
**States:** step 1–3 (with per-step validation), review, submitting (loading),
sent (confirmation), error ("Could not send"). **Tokens:** `color.action.primary`,
`color.status.critical` (error), `elevation-flat`, `space-6`.

### RatingStars
Star rating input with hover preview, keyboard arrows, and half-star precision.
Adds a field label, an optional numeric readout, and loading/empty/error states
on top of the substrate rating control.

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `number \| null` | — (uncontrolled if omitted) |
| `defaultValue` | `number` | `0` |
| `onChange` | `(value: number \| null) => void` | — |
| `max` | `number` | `5` |
| `precision` | `number` | `0.5` (half-star) |
| `readOnly` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `label` | `string` | — |
| `helperText` | `ReactNode` | — |
| `error` | `boolean` | `false` |
| `showValue` | `boolean` | `false` |
| `emptyText` | `string` | `'Not rated'` |
| `loading` | `boolean` | `false` |
| `name` | `string` | — (auto-generated) |

**States:** default, hover (preview), focus (visible ring), disabled,
read-only, empty (`emptyText` readout), error (critical stars + helper),
loading (skeleton). **Tokens:** `color.action.primary` (filled stars),
`color.action.primaryHover` (hover), `color.text.disabled` (empty stars),
`color.status.critical` (error), `text.label`, `space-2`.

### Slider
Range slider whose headline behavior is a **percentage label rendered on the
thumb (the circle)**: it appears on hover, on keyboard focus, and while
dragging. Adds a field label, an optional percentage readout, and
loading/empty/error states on top of the substrate slider.

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `number` | — (uncontrolled if omitted) |
| `defaultValue` | `number` | `0` |
| `onChange` | `(value: number) => void` | — (fires while dragging) |
| `onChangeCommitted` | `(value: number) => void` | — (fires on release) |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'medium'` | `'medium'` |
| `label` | `string` | — |
| `helperText` | `ReactNode` | — |
| `error` | `boolean` | `false` |
| `showValue` | `boolean` | `false` |
| `marks` | `boolean` | `false` |
| `formatLabel` | `(value: number, percent: number) => ReactNode` | — (rounded `%`) |
| `loading` | `boolean` | `false` |
| `name` | `string` | — (auto-generated) |

**States:** default, hover (percentage on the thumb), focus (visible ring +
percentage on the thumb), active/dragging, disabled, empty (`0%` readout), error
(critical track + helper), loading (skeleton). The on-thumb label defaults to the
value's percentage of the `min`–`max` range and can be overridden with
`formatLabel`. **Tokens:** `color.action.primary` (track, thumb, label fill),
`color.status.critical` (error), `color.text.secondary` (readout), `text.label`,
`radius-md`, `space-2`.

### Switch
On/off toggle whose headline behavior is a **state word that flips with the
toggle**: it reads the off text by default and switches to the on text the moment
the control is toggled (click or keyboard). Adds a field label, a live state
readout, and loading/error states on top of the substrate switch.

| Prop | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | — (uncontrolled if omitted) |
| `defaultChecked` | `boolean` | `false` |
| `onChange` | `(checked: boolean) => void` | — (fires on toggle) |
| `onText` | `string` | `'On'` |
| `offText` | `string` | `'Off'` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'medium'` | `'medium'` |
| `label` | `string` | — |
| `helperText` | `ReactNode` | — |
| `error` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `name` | `string` | — (auto-generated) |

**States:** default/off (`offText` readout), on (`onText` readout), hover, focus
(visible ring), disabled, error (critical label + helper), loading (skeleton).
The readout text defaults to `Off`/`On` and can be overridden with `offText`/
`onText`. **Tokens:** `color.action.primary` (track/thumb when on, focus ring),
`color.status.critical` (error), `color.text.primary` (on readout),
`color.text.secondary` (off readout), `text.label`, `space-1`, `space-2`.

---

_ADS is the system of record. The substrate serves it, not the other way around._
