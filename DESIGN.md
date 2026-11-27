---
name: QR & Barcode Studio
description: The QR Code and barcode generator a Brazilian already knows how to use, finished to the standard of the category leaders.
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-pressed: "#1e40af"
  primary-soft: "#eaf1ff"
  primary-text: "#1d4ed8"
  on-primary: "#ffffff"
  bg-app: "#f5f6f8"
  bg-panel: "#ffffff"
  bg-sunken: "#eef0f3"
  border: "#dde1e7"
  border-strong: "#b9c0ca"
  text-main: "#111827"
  text-muted: "#4b5563"
  text-faint: "#5f6875"
  success: "#047857"
  success-soft: "#e8f7f0"
  warning: "#a14d07"
  warning-soft: "#fff6e5"
  danger: "#b91c1c"
  danger-soft: "#fdeeee"
  dark-bg-app: "#0b1120"
  dark-bg-panel: "#131b2c"
  dark-bg-sunken: "#1c2537"
  dark-border: "#2a3548"
  dark-border-strong: "#46536a"
  dark-text-main: "#f1f4f8"
  dark-text-muted: "#c1c8d3"
  dark-text-faint: "#9aa4b3"
  dark-primary-hover: "#3b74f0"
  dark-primary-pressed: "#1d4ed8"
  dark-primary-soft: "rgba(59, 130, 246, 0.16)"
  dark-primary-text: "#8db4ff"
  dark-success: "#4ade80"
  dark-success-soft: "rgba(74, 222, 128, 0.12)"
  dark-warning: "#fbbf24"
  dark-warning-soft: "rgba(251, 191, 36, 0.12)"
  dark-danger: "#f87171"
  dark-danger-soft: "rgba(248, 113, 113, 0.12)"
typography:
  headline:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  hint:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  micro:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
    fontFeature: "tnum"
rounded:
  sm: "6px"
  default: "8px"
  lg: "12px"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  2xl: "1.5rem"
  3xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.default}"
    padding: "0.625rem 1rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.default}"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
    typography: "{typography.button}"
    rounded: "{rounded.default}"
    padding: "0.625rem 1rem"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.bg-sunken}"
  button-ghost:
    textColor: "{colors.text-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.default}"
    padding: "0.625rem 1rem"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.bg-sunken}"
    textColor: "{colors.text-main}"
  button-link:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.default}"
    padding: "0.375rem 0.5rem"
    height: "44px"
  button-link-hover:
    backgroundColor: "{colors.bg-sunken}"
    textColor: "{colors.text-main}"
  icon-button:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.default}"
    size: "44px"
  input:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
    typography: "{typography.body}"
    rounded: "{rounded.default}"
    padding: "0.625rem 0.75rem"
    height: "44px"
  panel:
    backgroundColor: "{colors.bg-panel}"
    rounded: "{rounded.lg}"
    padding: "1.25rem 1.5rem"
  preview-stage:
    backgroundColor: "{colors.bg-sunken}"
    rounded: "{rounded.default}"
    padding: "1.25rem"
  segmented-track:
    backgroundColor: "{colors.bg-sunken}"
    rounded: "{rounded.default}"
    padding: "4px"
  segmented-option:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0.5rem"
    height: "40px"
  segmented-option-selected:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
  mode-switch:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.lg}"
    padding: "5px"
    height: "48px"
  mode-switch-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
  template-tile:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.default}"
    padding: "0.75rem 0.5rem 0.625rem"
  template-tile-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
  badge-ok:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
  badge-warn:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
  count-badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.full}"
    height: "20px"
  alert-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.default}"
    padding: "0.75rem 0.875rem"
  alert-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.default}"
    padding: "0.75rem 0.875rem"
  header:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
    height: "64px"
  history-drawer:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.text-main}"
    width: "400px"
---

# Design System: QR & Barcode Studio

## Overview

**Creative North Star: "The Tool You Already Know"**

QR & Barcode Studio looks like the category leaders on purpose. Cool grey ground, white panels drawn with 1px hairlines, slate ink and one blue: a visitor who has used QRCode Monkey or QR Code Generator recognises every control before reading a label. Familiarity is the design decision, not a fallback; the craft goes into finish (exact alignment, honest states, AA contrast, 44px targets) rather than into novelty.

The density is operational. One short task per visit, so the code is the hero and the chrome stays quiet: the live preview sits on a neutral grey stage beside the settings and stays in view while they change, and one blue button downloads it. Controls feel native because they are: segmented choices are real radio buttons, long lists are native selects, the colour field opens a real picker, sliders and checkboxes are platform inputs tinted blue. The dark theme mirrors the same structure on slate, keeping the action blue unchanged.

This world replaced the previous look and rejects it explicitly: no indigo-to-violet gradients, no emoji headings, no cards nested in cards, no bouncy motion.

**Key Characteristics:**
- One accent: Action Blue for the primary action, selection and focus; everything else is grey and slate.
- Flat white panels on a cool grey ground, separated by 1px hairlines with a barely-there shadow.
- Inter at a fixed rem ramp (0.75rem to 2rem); weight carries most of the hierarchy.
- Monospace with tabular numerals only for data: hex values, access keys, CNPJ, scanned text.
- Native-feeling controls at 44px minimum; the primary action and mode switch at 48px.
- Quiet functional motion: 150ms ease-out state changes, short entries for floating layers, nothing loops or overshoots.

## Colors

A neutral cool-grey system with a single saturated blue; state colours appear only as soft washes behind matching text.

### Primary
- **Action Blue** (#2563eb): the filled primary button (Baixar, Usar a câmera), checkbox and range accents, focus outlines, the selected colour preset, the scanner frame and the brand mark. Identical in both themes so the action looks the same day or night.
- **Action Blue, Hover / Pressed** (#1d4ed8 / #1e40af): background of the primary button on hover and press. Dark theme lifts hover to #3b74f0 and press to #1d4ed8.
- **Selection Wash** (#eaf1ff): background of the selected mode, the selected template tile and the history count badge. Dark theme uses a 16% blue tint (rgba(59, 130, 246, 0.16)).
- **Blue Text** (#1d4ed8): text and icons on the Selection Wash, and inline links. Dark theme uses #8db4ff.
- **On-Blue White** (#ffffff): label and icon colour on Action Blue.

### Neutral
- **Cool Grey Ground** (#f5f6f8): page background behind the panels. Dark: Night Ground (#0b1120).
- **Panel White** (#ffffff): panels, header, footer, drawer, popover, fields and secondary buttons. Dark: Night Panel (#131b2c).
- **Sunken Stage** (#eef0f3): the preview stage, the scanner viewport, segmented tracks, scanned-text blocks and every hover fill on neutral buttons. Dark: Night Stage (#1c2537).
- **Hairline** (#dde1e7): 1px borders on containers, panel-section dividers, header and footer rules, the NF-e table rules. Dark: Night Hairline (#2a3548).
- **Field Stroke** (#b9c0ca): 1px border on inputs, selects, the colour field and secondary buttons; anything you type into or press. Dark: Night Field Stroke (#46536a).
- **Slate Ink** (#111827): headings, body, values. Dark: Night Ink (#f1f4f8).
- **Muted Slate** (#4b5563): field labels, intro line, link buttons and icon buttons at rest. Dark: Night Muted (#c1c8d3).
- **Faint Slate** (#5f6875): hints, placeholders, meta lines, table labels. Still AA on every light surface (4.9:1 on the Sunken Stage). Dark: Night Faint (#9aa4b3).

### State
- **Confirm Green** (#047857) on **Confirm Wash** (#e8f7f0): the valid-key badge and the footer privacy lock. Dark: #4ade80 on a 12% tint.
- **Caution Amber** (#a14d07) on **Caution Wash** (#fff6e5): warning alerts and the check-digit-failed badge. Dark: #fbbf24 on a 12% tint.
- **Error Red** (#b91c1c) on **Error Wash** (#fdeeee): barcode validation errors and destructive hovers (delete history item, clear history). Dark: #f87171 on a 12% tint.

### Named Rules
**The One Blue Rule.** Action Blue fills exactly one button per view, the primary action. Selection and focus may use blue; secondary actions (Copiar, Copiar texto, WhatsApp, Facebook, Enviar imagem) stay neutral grey.

**The Code Is Content Rule.** The colours a person picks for their QR Code or barcode, and the template presets that set them, belong to the code, not to the palette. The stage around the code stays neutral grey so any user colour reads true, and the system never tints, overlays or decorates the code itself.

## Typography

**Display Font:** Inter (with system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Inter (same stack, weights 400, 500, 600, 700 from Google Fonts)
**Label/Mono Font:** the platform monospace stack (ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono) with tabular numerals

**Character:** One neutral grotesque doing every job, the same face the category leaders use; it reads as a tool, not a brand statement. The system monospace appears only where a person compares characters.

### Hierarchy
- **Headline** (700, 2rem, 1.2, -0.02em): the single page h1. Steps down to 1.75rem below 960px and 1.25rem at 480px and below; balanced wrapping.
- **Title Large** (600, 1.125rem, 1.4): drawer heading (Histórico) and the scan-result heading.
- **Title** (600, 1rem, 1.4): panel section titles (Conteúdo, Modelos prontos, Cores, Estilo, Logo no centro).
- **Body** (400, 1rem, 1.5): base text, the intro line, every input and select (1rem keeps mobile browsers from zooming).
- **Body Small** (400, 0.9375rem, 1.5): checkbox labels, toast, scanned text, history item text, scanner placeholder copy.
- **Button** (600, 0.9375rem, 1.2): every button label; the large download button steps up to 1rem.
- **Label** (500, 0.875rem): field labels, segmented options, footer, alerts.
- **Hint** (400, 0.8125rem): help text under fields, history meta lines, template names.
- **Micro** (500, 0.75rem): segmented sub-hints (7%, 15%), NF-e table labels, count badge.
- **Brand name** (700, 1.0625rem, -0.01em): header wordmark only.

### Named Rules
**The Fixed Ramp Rule.** Sizes are fixed rem steps between 0.75rem and 2rem, never fluid clamps; hierarchy comes from weight (400 / 500 / 600 / 700) and ink (Slate, Muted, Faint) before size.

**The Mono Means Data Rule.** The monospace stack with tabular numerals is reserved for values a person reads character by character: hex colours, NF-e access keys, CNPJ, series and numbers, scanned text. Counts and percentages in proportional text use tabular numerals without switching face.

## Layout

A single centred column capped at 1120px with a 1.5rem gutter (1rem at 480px and below). The header is a 64px bar (56px on phones) on Panel White with a hairline underneath, its contents aligned to the same 1120px width; the footer mirrors it.

Below the header: a centred h1 and one-line promise, then the three-way mode switch (centred, max 600px). The work area is a CSS grid. Up to 959px everything stacks: mode, content, preview, settings. From 960px it becomes two columns, preview on the left (`minmax(0, 460px)`) and content plus settings on the right (`1fr`), with a 2rem column gap and 1.25rem row gap; the preview column is sticky 1.5rem from the top. The scanner replaces the trio with its own grid: stacked on phones, 1.1fr capture and 1fr result from 960px.

Spacing follows a 4px-based rhythm: 0.25rem inside segmented tracks, 0.5rem between buttons in a row, 0.75rem inside compact groups, 1rem between stacked fields, 1.25rem panel padding and grid gap, 1.5rem section side padding and page gutter, 2rem between desktop columns.

At 480px and below the layout sheds, it doesn't shrink: the intro's privacy sentence and the live-update hint hide (the footer still carries privacy), mode-switch icons hide, share-button icons hide, two-column field rows collapse to one, the template grid goes from four columns to two, scanner buttons stack, and the on-screen QR preview caps at 220px wide while the exported file keeps its size.

### Named Rules
**The Preview Stays in View Rule.** In the generator modes the code is always visible while settings change: sticky beside the settings from 960px, and placed directly after Conteúdo on phones with its download button under it.

## Elevation & Depth

Hairline-first and nearly flat. Panels are defined by a 1px Hairline border plus the faintest shadow (`--shadow-sm`); hierarchy between surfaces comes from tone (Cool Grey Ground, Panel White, Sunken Stage), not from lift. Real shadows are kept for two jobs: lifting the rendered code off its stage like a printed label, and separating layers that float above the page (colour popover, history drawer, toast). In the dark theme the same three steps switch to pure-black shadows at higher opacity.

### Shadow Vocabulary
- **Hairline lift** (`box-shadow: 0 1px 2px rgba(17, 24, 39, 0.06)`): panels and the mode-switch track at rest.
- **Label lift** (`box-shadow: 0 2px 6px rgba(17, 24, 39, 0.08), 0 1px 2px rgba(17, 24, 39, 0.06)`): the rendered QR canvas and barcode SVG on the preview stage.
- **Float** (`box-shadow: 0 12px 32px rgba(17, 24, 39, 0.14), 0 2px 6px rgba(17, 24, 39, 0.08)`): colour popover, history drawer, toast.
- **Selected segment** (`box-shadow: 0 1px 3px rgba(17, 24, 39, 0.12), 0 0 0 1px var(--border)`): the white selected option inside a segmented track.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35)`): fields and the open colour field, paired with an Action Blue border. Everything else focuses with a 2px Action Blue outline at 2px offset.

### Named Rules
**The Hairline First Rule.** A surface earns a border before it earns a shadow; only the rendered code and floating layers get more than the hairline lift.

## Shapes

Three radii that nest, plus a pill. 12px for the outer layer (panels, mode-switch track, colour popover), 8px for controls and the areas inside a panel (buttons, inputs, selects, preview stage, scanner viewport, segmented track, template tiles, alerts, NF-e table, history rows), 6px for elements inside those (segmented options, colour chips, template swatches, logo thumbnail, small close buttons). The full pill (999px) is only for badges. Two deliberate exceptions: 4px on the tiny colour-preset squares and 2px on the rendered QR canvas, which must stay a crisp square.

Borders are always 1px: Hairline on containers and dividers, Field Stroke on anything you type into or press. The brand mark carries the geometry of the product: an Action Blue rounded square (8px on a 32px tile) holding three outlined QR finder eyes and a few data modules in white; the same drawing is the SVG favicon. The scanner placeholder repeats it as four rounded corner brackets with a faint scan line.

### Named Rules
**The Nesting Radius Rule.** An element's radius is never larger than its container's: 12 outside, 8 inside, 6 inside that.

## Components

Icons throughout are the Ant Design outline set (react-icons/ai), 1.125rem inside buttons and alerts, 1.25rem in icon buttons and the mode switch; the few custom SVGs (theme sun and moon at a 1.8 stroke, scanner frame, brand mark) are drawn to match that line.

### Buttons
Plain, labelled with their action, one blue.
- **Shape:** gently rounded (8px), 1px border slot always present so variants align.
- **Primary:** Action Blue fill, white 600-weight label, 0.625rem 1rem padding, 44px tall; the main action of a view (Baixar PNG, Usar a câmera) is 48px and the download label steps up to 1rem.
- **Hover / Focus:** hover and press darken the fill (Action Blue, Hover then Pressed) over 150ms ease-out; focus is a 2px Action Blue outline at 2px offset. Disabled drops to 50% opacity with a not-allowed cursor.
- **Secondary:** Panel White with a Field Stroke border and Slate Ink label; hover fills Sunken Stage. Used for Copiar, Escolher imagem, Enviar imagem, the scan-result copy and open actions, and the barcode use-example reset (40px there).
- **Ghost:** transparent with the full button padding and 600 label in Muted Slate; hover fills Sunken Stage and darkens to Slate Ink. Used for Histórico in the header and for clearing history, where the hover turns to Error Wash and Error Red.
- **Link:** the quietest action: transparent, Muted Slate, 500 weight, 0.375rem 0.5rem padding, still 44px tall; hover fills Sunken Stage and darkens to Slate Ink. Used for the share row (Copiar texto, WhatsApp, Facebook) and the scan-result shortcuts back into the generators.
- **Icon button:** 44px square, transparent, Muted Slate icon; hover fills Sunken Stage. A danger variant hovers to Error Wash.

### Segmented Control
The house replacement for chips and toggles, built on native radio buttons inside a fieldset so arrow keys, focus and screen readers work without extra code.
- **Style:** a Sunken Stage track (8px, 4px padding, 4px gaps) holding equal-width options (6px, 40px tall, Muted Slate, 500 weight). An option can carry a micro sub-hint (L 7%, M 15%, Q 25%, H 30%).
- **State:** the selected option becomes a Panel White pill with Slate Ink 600 label and the Selected segment shadow; hover darkens the label; keyboard focus draws a 2px Action Blue outline at 1px offset. Used for export format, module style, eye style and error correction.

### Navigation
- **Header:** 64px Panel White bar with hairline; brand mark plus wordmark on the left, Histórico (ghost button with a pill count badge in Selection Wash) and the theme icon button on the right. On phones the Histórico label becomes visually hidden and the bar drops to 56px.
- **Mode switch:** the large segmented control as primary navigation between QR Code, Código de barras and Ler código. Panel White track with Hairline border and hairline lift (12px, 5px padding), 48px options with a 1.25rem icon; the selected mode turns Selection Wash with Blue Text instead of the white pill. On phones icons hide and options stay in a 44px row.
- **History drawer:** a native dialog sliding in from the right (400px, full height), Panel White with a Hairline left edge, Float shadow and a 40% Slate Ink backdrop. Rows are full-width buttons with a 40px colour-swatch icon, 500-weight preview text (truncated) and a Faint Slate meta line; hover fills Sunken Stage. Empty state: a faint outline icon, a 600-weight line and a short muted explanation.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Panel White on the Cool Grey Ground.
- **Shadow Strategy:** hairline lift only (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** panel sections are 1.25rem 1.5rem (1rem on phones); consecutive sections inside one panel are divided by a 1px Hairline rule, never by a nested card. The preview and scanner panels use 1.25rem all round.

### Inputs / Fields
- **Style:** Panel White, 1px Field Stroke, 8px radius, 0.625rem 0.75rem padding, 44px minimum, 1rem text; placeholders in Faint Slate. Textareas resize vertically from 5.5rem. Selects are native with the appearance reset and a drawn chevron.
- **Focus:** border turns Action Blue with the 3px focus ring; hover alone darkens the border to Faint Slate.
- **Colour field:** a 44px trigger holding a 30px swatch chip and the hex value in mono; open, it takes the focus treatment and drops a 240px popover (12px, Float shadow) with the picker, a mono hex input and an 8-column grid of preset squares (selected preset ringed in Action Blue).
- **Checkbox and range:** native inputs tinted with accent-color Action Blue; checkboxes are 18px inside a 44px-tall label; ranges sit under a label row with the tabular value right-aligned.
- **Error / Disabled:** validation problems surface as an alert beside the field rather than red borders; disabled controls drop to 50 to 55% opacity.

### Template Tiles
Four equal tiles (two per row on phones) that apply a ready-made colour and style preset. Panel White, 1px Hairline, 8px radius, a 40px swatch (6px, inset hairline ring) above a 0.8125rem name; hover darkens the border and fills Sunken Stage; the selected tile (aria-pressed) gets an Action Blue border doubled by an inset ring, Selection Wash fill and Blue Text 600 label. These are the one place bordered tiles sit inside a panel, because each is a selectable control.

### Badges, Alerts and Toast
- **Status badge:** pill, 0.8125rem 600, 0.25rem 0.625rem padding with a 1rem icon; Confirm Wash and Green for a valid NF-e key, Caution Wash and Amber when the check digit fails.
- **Alert:** an 8px wash block (Caution or Error) with matching text, a 1.125rem leading icon and 0.875rem copy; the barcode error alert carries a use-example reset button.
- **Toast:** bottom-centred, inverted (Slate Ink background with near-white text in light mode, Night Ink background with Slate Ink text in dark), 8px radius, Float shadow, a coloured status icon and a 36px close button; enters with a 200ms fade and 8px rise.

### Preview Stage (signature)
The hero of every generator view. A Sunken Stage area (8px, 1.25rem padding, 300px minimum height on larger screens) centres the rendered code, which sits on its own colours with the Label lift so it reads like a printed label. Under it: a centred 0.875rem meta line in Muted Slate (format and value, or the example prompt), then the action row (48px Baixar plus 48px Copiar secondary), then the export settings row (format segmented control and the transparent-background checkbox).

### Scanner and NF-e Result (signature)
The capture panel is a 4:3 Sunken Stage viewport (8px, clipped) showing the live camera, or a centred placeholder with the Action Blue scanner frame, a 1.0625rem 600 title and a 34ch muted explanation; two 48px buttons sit under it (Usar a câmera primary, Enviar imagem secondary; stacked on phones). The result panel shows the scanned text in mono on a Sunken Stage block, and for NF-e / NFC-e keys a ruled two-column table built from 1px gaps over the Hairline colour: Micro labels in Faint Slate over 500-weight mono values, with the full access key spanning both columns on Sunken Stage.

## Do's and Don'ts

### Do:
- **Do** reserve Action Blue (#2563eb) for one filled primary button per view, selected states and focus.
- **Do** keep secondary actions neutral: the Panel White secondary button with a Field Stroke border, or the Muted Slate ghost and link buttons with a Sunken Stage hover.
- **Do** divide a panel into sections with a 1px Hairline rule and 1.25rem 1.5rem padding instead of adding an inner card.
- **Do** build choices on the Segmented control over native radios, use native selects for long lists and native checkbox and range inputs tinted with accent-color.
- **Do** keep every interactive target at least 44px tall, and the main action of a view at 48px.
- **Do** set hex values, access keys, CNPJ and scanned text in the mono stack with tabular numerals.
- **Do** keep the rendered code on the neutral Sunken Stage with the Label lift, at its own colours.
- **Do** define every new colour token in both the light `:root` block and the `.dark` block of App.css.
- **Do** animate only colour, border and shadow on state changes (150ms, cubic-bezier(0.22, 1, 0.36, 1)), and short fades or slides for floating layers, all collapsed under prefers-reduced-motion.

### Don't:
- **Don't** use gradients on any surface, button, text or icon.
- **Don't** use emoji in headings, labels or buttons; icons are the Ant Design outline set or SVGs drawn to match it.
- **Don't** nest a bordered, shadowed card inside a panel; bordered tiles inside a panel are only for selectable controls like the template tiles.
- **Don't** use bouncy or overshooting easing, or any looping or decorative animation.
- **Don't** colour secondary or text actions blue; blue belongs to the one primary action.
- **Don't** tint, overlay or decorate the code inside the preview stage; scan reliability comes before decoration.
- **Don't** use the legacy alias variables (--text-primary, --text-secondary, --bg-primary, --bg-secondary, --secondary, --border-color) in new CSS; use the base names (--text-main, --text-muted, --bg-panel, --bg-sunken, --border).
