---
name: Gridiron Vice
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffb1c5'
  on-secondary: '#65002f'
  secondary-container: '#e30071'
  on-secondary-container: '#fffbff'
  tertiary: '#d6ffea'
  on-tertiary: '#003827'
  tertiary-container: '#a6e7c9'
  on-tertiary-container: '#296a51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c5'
  on-secondary-fixed: '#3f001b'
  on-secondary-fixed-variant: '#8f0045'
  tertiary-fixed: '#aff1d2'
  tertiary-fixed-dim: '#93d4b6'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#07513a'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  tabular-clock:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the electric, late-night tension of high-stakes sports wagering, tactical playbook breakdowns, and retro arcade-action pedigree. Designed for sports analysts, hardcore fantasy managers, and data-driven NFL bettors, the interface strips away generic sports broadcast fluff in favor of an illicit, high-octane control room aesthetic.

The visual direction marries modern telemetry interfaces with a retro late-night coastal noir tone:
- **Atmosphere:** Pitch-black command room meets midnight Vice City turf. High contrast, precise, and hyper-legible under low ambient lighting.
- **Visual Weight:** Ultra-crisp 1px slate scaffolding, stark neon callouts for high-leverage data (turnovers, red zone efficiency, EPA/play), and vintage tactical stamp motifs.
- **Attitude:** Unapologetic, razor-sharp, kinetic, and deeply statistical.

## Colors

The palette operates on pure dark-mode dynamics, anchored by obsidian baseplates with high-voltage accent strikes.

### Role Assignments
- **Canvas & Baseplates (`#0D1117`):** The master canvas, deadening optical glare and establishing deep contrast.
- **Card & Container Surfaces (`#161B22`):** Elevated data panels, telemetry cards, and roster grids.
- **Structural Borders (`#30363D`):** 1px technical wireframes, grid cells, and separator rails.
- **Primary Accent (`#00F0FF` / Vice City Cyan):** Live game clocks, target track routes, passing charts, and positive delta values (+EPA, win probability surges).
- **Secondary Accent (`#FF2A85` / Neon Magenta):** Red zone alerts, critical penalties, injury flags, turnover metrics, and active blitz indicators.
- **Tertiary Accent (`#125740` / Deep Turf Green):** Field possession markers, verified statistical baselines, and ground-game analytics.
- **Text & Telemetry:**
  - `text-primary`: `#F0F6FC` (pure metric clarity)
  - `text-secondary`: `#8B949E` (axis labels, defensive scheme tags, down-and-distance metadata)
  - `text-muted`: `#484F58` (inactive states, background yard line rules)

## Typography

The typographic hierarchy uses three distinct type engines to drive clarity and attitude:
1. **Space Grotesk (Headlines & Display):** High-tension, geometric, slightly off-kilter technical headlines that channel game title screens and tournament brackets.
2. **Inter (Interface & Editorial Body):** Transparent, ultra-legible neutral body text engineered for analytical density and player commentary.
3. **JetBrains Mono (Metadata, Timers, Stats & Telemetry):** Tabular, monospaced efficiency. Used for clocks (`04:12 Q4`), yard line trackers (`NYJ 34`), EPA splits, and bet slips.

### Typographic Rules
- All badges, status codes, and timers must be rendered in `JetBrains Mono` with uppercase transformation.
- Scores and down/distance markers prioritize tabular figures to prevent horizontal shifts during live socket updates.

## Layout & Spacing

The architecture operates on an unyielding, high-density 12-column modular grid designed for dashboard throughput:
- **Mobile (< 768px):** 4-column layout, compact margins (`space-md`), single-column card flows with horizontally swiping metric strips.
- **Tablet (768px - 1024px):** 8-column layout, side-by-side analytical splits and persistent drive charts.
- **Desktop (> 1024px):** 12-column layout with fixed telemetry rail (3 columns) and dynamic analytical canvas (9 columns). Max width capped at 1600px for ultrawide consistency.

Spacing rhythm is strictly condensed. Vertical spacing emphasizes tight analytical clustering, letting data borders (`#30363D`) delineate structure rather than excessive negative space.

## Elevation & Depth

This system intentionally rejects muddy soft drop-shadows. Depth is articulated via layered slate borders, tonal stacking, and neon perimeter back-glows.

- **Base Layer:** Canvas tone `#0D1117`.
- **Level 1 (Cards, Modules, Sidebars):** Surface fill `#161B22` bounded by a strict `1px solid #30363D` outline. No drop shadow.
- **Level 2 (Popovers, Flyouts, Selected Cells):** Surface fill `#21262D` with `1px solid #8B949E` border.
- **Level 3 (Active Gameplay State / Highlight Overlays):** Uses targeted neon glow bleeds. Box shadow is calibrated to `0 0 12px rgba(0, 240, 255, 0.25)` for Cyan and `0 0 12px rgba(255, 42, 133, 0.25)` for Magenta.
- **Data Table Interactivity:** Hovered rows invoke an immediate background shift to `#21262D` with an absolute `2px solid #00F0FF` left edge indicator strip.

## Shapes

The interface embraces a low-radius, tactical geometry (`roundedness: 1` / 4px base radius). Surfaces look chiseled, industrial, and precise.

- **Standard Cards & Modals:** `rounded` (4px). Avoids circular softness in favor of structural grid feeling.
- **Data Tags & Badges:** `rounded-sm` (2px) or sharp (0px) to simulate military HUD stamps and arcade arcade cartridges.
- **Buttons:** 4px radius with optional 45-degree micro-chamfers on featured CTA modules.
- **Pills/Circles:** Strictly reserved for circular player avatars and status heartbeat indicator dots. Never used for buttons or data chips.

## Components

### Buttons & Interactive Controls
- **Primary Action (Vice Punch):** Background `#00F0FF`, text `#0D1117` (`label-lg`, font weight 700), border none. Hover state initiates an instant shift to `#FF2A85` with white text.
- **Secondary Ghost:** Background `transparent`, `1px solid #30363D`, text `#F0F6FC`. Hover triggers border color change to `#00F0FF` and text `#00F0FF`.
- **Destructive / Live Threat:** Background `rgba(255, 42, 133, 0.1)`, `1px solid #FF2A85`, text `#FF2A85`.

### Chips, Tags & Badges
- **Down & Distance Badge:** Dark obsidian fill (`#0D1117`), `1px solid #30363D`, text in `JetBrains Mono` (`label-md`).
- **Retro Gaming Status Stamps:** Text framed by a thick 1.5px border, set at a slight 2-degree skew with uppercase typography (e.g., `[RED ZONE]`, `[INTERCEPTION]`, `[OFFICIAL REVIEW]`). Neon Magenta for turnover/fumble; Vice Cyan for explosive play (>20 yards).

### Data Tables & Analytics Grids
- **Header:** Sticky `#0D1117`, typography `label-sm` in `#8B949E`, uppercase, bottom border `1px solid #30363D`.
- **Cells:** Tabular monospaced numbers aligned right; player names and position badges aligned left. Cell padding: `space-sm` vertical, `space-md` horizontal.
- **Deltas:** Positive numbers prefixed with `+` in `#00F0FF`; negative numbers in `#FF2A85`.

### Input Fields & Search Bars
- Background `#0D1117`, border `1px solid #30363D`, text `#F0F6FC`.
- Focused state eliminates generic browser rings and switches border to `1px solid #00F0FF` with a subtle inner glow: `box-shadow: inset 0 0 6px rgba(0, 240, 255, 0.2)`.

### Cards & Telemetry Containers
- Container fill `#161B22`, border `1px solid #30363D`.
- Top-right card corner includes technical coordinates or widget status (`SYS.01 // LIVE`) rendered in `label-sm` `#484F58`.

### Specialized Sports Components
- **Drive Chart Visualizer:** Field represented in deep turf slate (`#125740` at 15% opacity), yard lines stroked in 1px dashed `#30363D`, ball position denoted by a pulsing `#00F0FF` point with neon tail trail.
- **Game Clock / Shot Clock:** Monospace block with `#0D1117` background plate, bordered in `#30363D`, displaying high-contrast active seconds in `#00F0FF`.