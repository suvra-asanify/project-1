## Design Token Structure – Figma Design System

### High-level collections

- **Base tokens**
  - Typography primitives such as `type/typeface = Quicksand`, size scales (`xs/size = 12`, `sm/size = 14`, `base/size = 16`, `2xl/size = 34`, `3xl/size = 48`) and their line heights.
  - Weight primitives (`weight/Regular`, `weight/Medium`, `weight/SemiBold`, `weight/Bold`).
  - Core spacing scale (`spacing/0`, `spacing/0․5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`, `spacing/6`, `spacing/7`, `spacing/8`, `spacing/9`, `spacing/10`, `spacing/12`, `spacing/16`) plus aliases like `Spacing/4`, `Spacing/7`, `Spacers/4`.
  - Radius primitives (`Radius/2`, `Radius/4`) and higher-level aliases (`rounded/0`, `rounded/sm`, `rounded/md`, `rounded/lg`, `rounded/xl`, `rounded/pill`, `size/border-radius/br-pill`, `Borders/Rounded/*`).
  - Border/base primitives (`size/border-width/bw-sm`, `border-width`) and opacity primitives (`opacity`, `opacity/12`, `opacity/50`).

- **Alias / semantic tokens**
  - Text color roles: `color/text/primary`, `color/text/secondary`, `color/text/inverse/primary`, `color/text/interactive`, `color/text/error`.
  - Icon roles: `color/icon/primary`, `color/icon/secondary`, `color/icon/inverse/primary`, `color/icon/interactive`, `color/icon/info`, `color/icon/success`, `color/icon/warning`, `color/icon/error`, `color/icon/progress`.
  - Surface roles: `color/surface/primary`, `color/surface/background`, `color/surface/left-nav`, `color/surface/interactive`, `color/surface/interactive 2`, `color/surface/darken`, `surface/light`, `surface/dark`, status surfaces (`color/surface/info/light`, `color/surface/success/light`, `color/surface/warning/light`, `color/surface/error/light`, `color/surface/progress`), scroll surfaces (`color/surface/scroll`, `color/surface/scroll-thumb`), and selection/active surfaces (`color/surface/New group/active`).
  - Border roles: `color/border/primary`, `color/border/interactive`, and status borders (`color/border/info`, `color/border/success`, `color/border/warning`, `color/border/error`).
  - Component-level aliases for specific UI patterns such as buttons, chips, avatars, icons, and lists (see below).

- **Device / layout / utility collections**
  - Layout paddings expressed in absolute px and rem-equivalent labels, for example `layout/padding/0 (0 rem)`, `layout/padding/2 (․125 rem)`, `layout/padding/48 (3 rem)`, `layout/padding/64 (4 rem)`.
  - Density and sizes for repeated patterns: `list/density` (40 or 48), `avatar/size`, `icon/small`, `icon/medium`, `icon/x-large`, `btn/size`, `icon-btn/size`, `chip/icon`, etc.
  - Negative spacings such as `spacing/n0․5`, `spacing/n1` for fine layout adjustments.

### Base → alias connections

- **Typography**
  - Font roles are defined as aliases on top of base font primitives, for example:
    - `body/base = Font(family: "type/typeface", style: weight/Medium, size: base/size, weight: 500, lineHeight: base/line-height, letterSpacing: 0)`.
    - `body/sm`, `body/xs` reference `sm/size`, `sm/line-height`, `xs/size`, `xs/line-height` plus weight primitives.
    - Label roles (`label/base`, `label/sm`, `label/xs`) use `type/typeface` and `weight/SemiBold` together with fixed-size variants like `base/fixed/size`, `sm/fixed/size`, `xs/fixed/size`.
    - Display roles such as `display/hero` and `display/section` are defined using `3xl/size`, `3xl/line-height`, `xl/size`, `xl/line-height` plus `weight/SemiBold`.
  - There is also an explicit typography token `type/font-size/fs-default = 16`, aligned with `base/size`.

- **Spacing and radii**
  - Component-level tokens (e.g. `btn/px`, `btn/py`, `btn/gap`, `icon-btn/padding`) are derived from the base spacing scale (values like 4, 6, 8, 20 etc.).
  - Radius aliases like `rounded/md`, `rounded/lg`, `chip/corner`, `Borders/Rounded/rounded-default`, and `Borders/Rounded/rounded-circle` sit on top of the primitive radius tokens (`Radius/2`, `Radius/4`) and provide consistent rounding across components.
  - Pill shapes (`rounded/pill`, `size/border-radius/br-pill`) are consistently defined with large numeric values (9999 or 200) for fully rounded elements.

- **Color system**
  - Base color swatches are not surfaced directly; instead, semantic roles (text/icon/surface/border) are defined with hex values and reused across patterns.
  - Status colors are consistently tripled into `icon`, `surface/*/light`, and `border` roles for **info**, **success**, **warning**, **error**, and **progress**, creating a clear semantic mapping for status UI.
  - Interactive color roles (`color/text/interactive`, `color/surface/interactive`, `color/border/interactive`, `icon`) share the same brand blue (`#005a9c` and its alpha variants).

### Component-level aliases

- **Buttons**
  - Button tokens layer on top of base typography, spacing, and color tokens:
    - Font: `btn/font/size`, `btn/font/line-height` reference the core type scale.
    - Spacing: `btn/px`, `btn/py`, `btn/gap`, `btn/size`, `btn/loader` are tied to spacing and icon-size primitives.
    - Icon alignment: `btn/icon`, `btn/icon-top` for vertical alignment and sizing.
    - Borders: `size/border-width/bw-sm` and `border` (`#005a9cde`) ensure consistent strokes.
    - Shape: `round` and higher-level `rounded/*` tokens control curvature.

- **Icon buttons**
  - `icon-btn/size`, `icon-btn/padding`, and `icon-btn/icon` combine spacing primitives with the general icon-size tokens.

- **Chips**
  - Tokens such as `chip/font/size`, `chip/font/line-height`, `chip/icon`, `chip/corner` are aliases that wrap the base typographic scale and radius scale for chip components.

- **Avatars and lists**
  - `avatar/size`, `avatar/label` and `list/density` define component-specific sizes and densities, again using the base spacing and type scales as building blocks.

### Device / size / density patterns

- **Density**
  - Multiple nodes show list and item densities driven by `list/density` (40 or 48) and shared spacing tokens; these provide consistent row heights across tables, nav lists, and menus.

- **Icon and avatar sizes**
  - Icons use named sizes (`icon/small`, `icon/medium`, `icon/x-large`) aligning with base pixel values, which are then wired into buttons and icon-button tokens.
  - Avatars share a consistent `avatar/size` and `avatar/label` typographic role to remain legible at those sizes.

- **Shadows and elevation**
  - Elevation is expressed as effect tokens, for example:
    - `default` and `elevation/2` are compound drop-shadow definitions that can be reused across components for consistent depth.

### How to interpret this structure

- **Base collections** provide raw scales: type sizes, weights, radii, spacing, and basic measurement tokens.
- **Alias/semantic collections** map those primitives into meaningful roles (text/icon/surface/border/status) that match design intent.
- **Component collections** (buttons, chips, icons, avatars, lists) are thin semantic layers on top of base and alias tokens, encoding density, padding, and curvature for each pattern.
- **Device/size/density collections** (layout paddings, list densities, icon/avatar sizes, elevation) allow the same semantic roles to be applied consistently across different surfaces and breakpoints without redefining raw values.
