<!-- Text extracted by Pivota from EPMP-Design-System.pdf (PDF). The original file is alongside this one. -->

# EPMP-Design-System.pdf

TECHSUR SOLUTIONS  /  PRODUCT DESIGN

EPMP
Design System

Foundations, tokens, components and build standards for the
Emergency Preparedness & Management Platform.

Modern, simple, minimalist
One accent, flat surfaces Accessible by default
WCAG 2.2 AA, Section 508 Built for LLMs
Tokens, rules, prompt
 2EPMP Design System · TechSur Solutions · November 2026

Contents

01 Introduction 3

02 Design principles 4

03 Hard rules 5

04 Visual foundations 6

05 Color 7

06 Contrast verification 12

07 Typography 14

08 Spacing, shape and elevation 16

09 Motion, layers and breakpoints 18

10 Iconography 20

11 Components 21

12 Page patterns 48

13 Data visualization 50

14 Maps 52

15 Accessibility 54

16 Content and voice 56

17 Governance 58

18 LLM build guide 59

This document mirrors the EPMP Design System artifact. Components: 40. Themes: light, dark, high contrast. Fonts: Lato and IBM Plex Mono. Token values
and rules in this PDF are the source of truth for the build prompt in the final chapter.
 3EPMP Design System · TechSur Solutions · November 2026

CHAPTER 01
Introduction

Build every EPMP surface from this system: EOC dashboard, incident workspace, field mobile, executive

briefing, partner portal and admin.

Build every EPMP surface (EOC dashboard, incident workspace, field mobile, executive briefing, partner portal, admin) from

this system. EPMP is the TechSur Emergency Preparedness & Management Platform: an open, interoperable, AI-enabled

workspace that carries an agency from preparing, to monitoring, activating, coordinating, recovering and improving. The
interface serves people under stress, on shared screens and in the field, so it is calm, legible and unambiguous. Modern, simple,

minimalist, clean: nothing decorative, one clear next action per region.

Read in this order: this README, then  llm-build-guide.md  (the build contract and a paste-ready prompt),  patterns.md

(page layouts),  data-visualization.md ,  maps.md ,  accessibility.md ,  content-and-voice.md ,  governance.md . Per
component, read  components/<Name>/README.md . Tokens are in  tokens.json ; the compiled  tokens.css  defines every

token as a CSS custom property of the same name ( --ink ,  --space-4 ,  --radius-md ) and a class for each type style ( .h2 ,

.body ,  .caption ).

To build with it: load  tokens.css ,  components/bundle.css , React 18 and  components/bundle.js , which exposes

window.EPMP  with 40 components. Wrap the app root in an element with  data-theme="light" | "dark" | "contrast" .

Light is the default, dark is for low-light operations centers, contrast is the Section 508 high-contrast theme (7:1 text).
 4EPMP Design System · TechSur Solutions · November 2026

CHAPTER 02
Design principles

1. Calm under pressure. Quiet surfaces, one accent, big clear states. Color signals status only. Never decorate an emergency.

2. Clarity over density, density where it earns its place. Default to 14px body and generous spacing. Dense tables are

allowed in operating views, never in forms.

3. One next action. Each region has one  primary  Button. The thing to do next is visible without scrolling.

4. Evidence and provenance. Every fact shows where it came from and when ( Provenance ). Unverified is visibly unverified.

5. Humans decide. AI drafts, people approve ( AIDraft ). Nothing AI-generated is issued, sent or binding on its own.

6. Works when connectivity does not. Offline and degraded states are first-class ( SyncStatus , queued counts, reconcile).

7. Accessible by default. WCAG 2.2 AA and Section 508 on every screen; keyboard and touch parity.
 5EPMP Design System · TechSur Solutions · November 2026

CHAPTER 03
Hard rules

Non-negotiable. Every screen is checked against these.

Use tokens only. Never write a hex color, a pixel size outside the scale, a font name or a shadow. Reference  var(--

token) .

One  primary  Button per region. Destructive actions use  danger  and a  Modal  confirmation.

Status is icon plus word plus color. Never color alone.

Text meets 4.5:1 (7:1 in  contrast ) on the ground it sits on; controls and focus meet 3:1.

All AI output goes through  AIDraft . All ingested facts carry  Provenance .

Charts and maps use only the chart and map components; no third-party chart styling, no color-only series.

Every list, table and panel has loading, empty and error states.

No gradients, shadows on cards, colored side borders, emoji, stock imagery or decorative motion.

Touch targets are at least 44px on field-mobile screens ( control-lg ,  size="lg" ).

Do not claim FedRAMP authorization anywhere in product UI or copy.
 6EPMP Design System · TechSur Solutions · November 2026

CHAPTER 04
Visual foundations

Color. Neutral-first with one brand and one accent. Ground is  bg ; panels  bg-subtle ; wells  bg-sunken ; cards  bg-raised

with a  border . Text is  ink  (primary) or  ink-muted  (secondary), never lighter. Brand teal ( brand ,  brand-hover ,  brand-

active ) is for the primary action, selection and links ( brand-text ); text on it is  on-brand . Navy ( bg-inverse ) is for
tooltips and toasts. Gold ( accent ) is a single highlight per view: the brand mark, one emphasis. Never body text. Status uses

the four triplets ( info-* ,  success-* ,  warning-* ,  danger-* ):  -solid  fill with its  on-*  text,  -subtle  ground with  -

text , and  -border . Every status carries an icon and a word. Success is a bluish green and danger a vermillion red: never rely

on hue alone. Charts use  viz-1  to  viz-6  (categorical) or  seq-1  to  seq-5  with  on-seq-*  text (sequential), always with
labels, direct values and a legend; separate series by shape, pattern or lightness as well as hue. Base maps use the muted  map-

*  tokens.

Type. Lato for everything (400 and 700 only); IBM Plex Mono ( code ,  data ) for identifiers, timestamps, log lines, API paths.

Page title  h1  (32/40), section  h2  (24/32), card title  h3  (20/28) or  h4  (16/24), reading and mobile text  body-lg  (16/24),
UI text  body  (14/20),  label  (13/16 bold) for buttons, tabs and field labels,  caption  (12/16) is the minimum size.  display

(40/48) only for executive briefing numbers. One  h1  per page; never skip heading levels. Max line length is  reading-max

(720px) for plans, SOPs and AI text.

Spacing and layout. A 4px base scale ( space-1  4 to  space-20  80). Inside components use  space-2  to  space-4 ; card
padding  space-6  ( space-4  on mobile); gap between cards  space-6 ; sections inside a page  space-8 ; page top  space-

12 . 12-column grid with 24px gutters up to  content-max  (1200px); breakpoints  bp-sm  640,  bp-md  768,  bp-lg  1024,

bp-xl  1280. Side navigation ( nav-width  240, collapsed 64) below  bp-md  becomes a bottom bar. Align to the grid; never

snap-fix with arbitrary pixel values.

Shape, borders, elevation. Borders and tone separate surfaces, shadows do not. Radii:  radius-sm  (badges, checkboxes),

radius-md  (buttons, inputs),  radius-lg  (cards, alerts),  radius-xl  (modals),  radius-full  (pills, avatars, switches).

Shadows only on overlays:  shadow-md  menus and popovers,  shadow-lg  modals. Hover on a card changes its border to

border-strong ; it does not lift. Control borders use  border-strong  (3:1); decorative dividers use  border .

States. Hover darkens fill one step ( brand-hover ) or tints with  bg-sunken ; pressed uses  brand-active ; disabled uses

ink-disabled  on  bg-sunken  at no elevation. Focus is a solid 2px  focus-ring  outline with 2px offset on every interactive

element, never removed. Selected is  brand-subtle  with a  brand  marker. Error is  danger-solid  border,  danger-text

message, icon and word. Loading is  Skeleton  for content and  loading  Buttons for actions.

Iconography. One stroke set, the  Icon  component: 24px grid, 1.75px stroke, round caps,  currentColor , 16/20/24px. Icons

support a word; they do not replace it except in  IconButton , which requires a label. No emoji, no filled or multicolor icons, no

second library. Missing glyph: draw it to the same rules and add it to  Icon . No logo file was supplied: the brand mark in the

navigation is a gold square plus the word "EPMP" in  h4 ; replace it with the official TechSur/EPMP mark when provided.

Imagery and maps. Product UI is flat and image-free. Maps (GIS) are the only imagery: use the agency's base layer styled with

the  map-*  tokens, and draw EPMP data with the marker shapes, tones and hazard areas in  maps.md , outlined for 3:1. Do not

use stock photos, illustrations, gradients, glassmorphism or decorative backgrounds.

Motion. Subtle and functional.  duration-fast  120ms (hover, focus, toggles),  duration-base  200ms (menus, tabs),

duration-slow  320ms (modals, drawers); easing  ease-standard  in,  ease-exit  out. Nothing loops except the  Skeleton

pulse and the Button spinner. Honor  prefers-reduced-motion  (already in  bundle.css ).
 7EPMP Design System · TechSur Solutions · November 2026

CHAPTER 05
Color

bg-inverse brand accent seq-2
 success-

solid
 danger-

solid
 info-

solid

Neutral-first with one brand teal and one gold accent. Three themes share the same token names: light (default), dark (low-

light operations centers) and contrast (high contrast, Section 508). Every text color holds 4.5:1 on the grounds named in its

usage note (7:1 in high contrast); borders, focus rings and marks that carry meaning hold 3:1.

Light (default) Dark (operations center) High contrast (Section 508)

Surfaces

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

bg #ffffff #0a1722 #ffffff Page background. Default ground for body text and the content
area.

bg-subtle #f6f8fa #0f2030 #f2f4f6 Quiet panels, table header and zebra rows, sidebar ground.

bg-sunken #edf2f5 #07111a #e6eaee Inset wells, input track ground, code blocks, skeletons.#0f2b43#0a7c84#e8b563#b3d8db#00695c#b3261e#1b5ea88EPMP Design System · TechSur Solutions · November 2026

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

bg-raised #ffffff #12283a #ffffff Cards, popovers, modals. Separated from bg by a border, not a
shadow, except overlays.

bg-inverse #0f2b43 #e8eef3 #00111f Inverse banners, tooltips, the navigation rail. Text on it is ink-
inverse.

bg-overlay #0f2b4380 #000000b3 #00111fcc Scrim behind modals and drawers.

Text

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

ink #0f2b43 #e8eef3 #00111f Primary text and icons on bg, bg-subtle, bg-raised and bg-
sunken.

ink-muted #4d5d6b #a3b3c1 #2a3947 Secondary text, helper text, captions, table meta on bg, bg-
subtle, bg-raised and bg-sunken.

ink-disabled #8794a0 #5d7284 #5a6a78 Disabled text and icons only. Exempt from contrast rules, never
carries required information.

ink-inverse #ffffff #0f2b43 #ffffff Text on bg-inverse.

ink-inverse-muted #b9c7d3 #44566a #c9d6e0 Secondary text on bg-inverse.

Borders and focus

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

border #dde5eb #22384a #5a6a78 Decorative dividers, card outlines, table rules. Not for form controls.

border-strong #7d8d9a #6b8396 #2a3947 Borders of inputs, checkboxes, radios, switches and any control that
must be perceivable (3:1).

focus-ring #1a5fb4 #7cc4ff #0b3f80 Keyboard focus ring: 2px solid with 2px offset, on every interactive
element. At least 3:1 on every surface.

Brand

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

brand #0a7c84 #4cc3cb #00505a Primary action fill, selected indicators, key marks. Pair text with on-
brand.

brand-hover #086a71 #6ad0d7 #003a42 Hover fill for brand surfaces.

brand-active #06565c #86dce2 #002a30 Pressed fill for brand surfaces.

brand-subtle #e4f1f2 #0f3a42 #e0f0f2 Selected row, active nav item, info callout ground. Text on it is ink or
brand-text.

brand-text #086a71 #6ad0d7 #00454e Links and brand-colored text on bg, bg-subtle, bg-raised and brand-
subtle.
 9EPMP Design System · TechSur Solutions · November 2026

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

on-brand #ffffff #06222a #ffffff Text and icons on brand, brand-hover and brand-active.

Accent

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

accent #e8b563 #e8b563 #f2b84b Gold highlight: a single emphasis mark per view (key rule, active tab
underline accent, warning fill). Never body text.

accent-subtle #fbf1dc #3a2f14 #fff1cc Soft gold ground for highlighted rows.

on-accent #0f2b43 #0f2b43 #00111f Text on accent and warning-solid.

Status

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

info-solid #1b5ea8 #5aa3f0 #0b3f80 Fill for info badges and markers.

info-subtle #e8f1fb #11304f #e6eefa Ground for info alerts and badges.

info-text #174f8c #8bbcf5 #0a3a75 Info text on info-subtle, bg, bg-raised.

info-border #9cc0e8 #2f5f96 #1b5ea8 Border of info alerts.

success-solid #00695c #3fc2a8 #004d43 Fill for success/ready markers. Bluish green, always paired with a
check icon or the word.

success-subtle #e3f3ef #0e3a33 #dff1ed Ground for success alerts and badges.

success-text #005a4f #6fd6c0 #004037 Success text on success-subtle, bg, bg-raised.

success-border #8fcfc2 #1f6b5d #00695c Border of success alerts.

warning-solid #e8b563 #e8b563 #f2b84b Fill for caution badges that carry on-warning text inside. Gold is
under 3:1 on bg, so never use it as a lone dot or icon; use warning-
text or warning-border for those.

warning-subtle #fdf3dc #3a2f14 #fff1cc Ground for warning alerts and badges.

warning-text #7a4b00 #f0c775 #5c3800 Warning text on warning-subtle, bg, bg-raised.

warning-border #ecc77a #7a5c1d #a06a00 Border of warning alerts.

danger-solid #b3261e #f0746b #8c1710 Fill for critical/error markers and destructive buttons. Always paired
with an alert icon or the word.

danger-subtle #fdeceb #43130f #fdeceb Ground for error alerts and badges.

danger-text #9c1f18 #f59a93 #7a120d Error text on danger-subtle, bg, bg-raised.
 10EPMP Design System · TechSur Solutions · November 2026

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

danger-border #eba9a5 #8a3029 #b3261e Border of error alerts.

on-info #ffffff #05213f #ffffff Text on info-solid.

on-success #ffffff #04251f #ffffff Text on success-solid.

on-warning #0f2b43 #0f2b43 #00111f Text on warning-solid.

on-danger #ffffff #3a0a07 #ffffff Text on danger-solid.

Data visualization (categorical)

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

viz-1 #0072b2 #4aa3df #005a8e Data series 1 (blue). Marks on bg and bg-raised.

viz-2 #c4510a #f08a4b #9a3f06 Data series 2 (vermillion).

viz-3 #00856a #3ec9a1 #006650 Data series 3 (bluish green).

viz-4 #a8487e #d98ab5 #862f60 Data series 4 (reddish purple).

viz-5 #b07800 #e0b04a #7f5700 Data series 5 (amber).

viz-6 #5b6b78 #9fb0be #3d4b57 Data series 6 (neutral). Distinguish series by lightness, shape or label as well
as hue.

Data visualization (sequential)

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

seq-1 #e4f1f2 #0f3a42 #e0f0f2 Sequential ramp step 1 (lowest). Heatmaps and choropleth; always show
the value and a legend.

seq-2 #b3d8db #17535c #bfe0e3 Sequential ramp step 2.

seq-3 #6fb5bb #226b73 #8cc3c8 Sequential ramp step 3.

seq-4 #4aa5ad #4cb0b8 #005a63 Sequential ramp step 4.

seq-5 #0a6a72 #8fdbe0 #00353c Sequential ramp step 5 (highest).

on-seq-1 #0f2b43 #e8eef3 #00111f Text on seq-1.

on-seq-2 #0f2b43 #e8eef3 #00111f Text on seq-2.

on-seq-3 #0f2b43 #e8eef3 #00111f Text on seq-3.

on-seq-4 #0f2b43 #06222a #ffffff Text on seq-4.
 11EPMP Design System · TechSur Solutions · November 2026

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

on-seq-5 #ffffff #06222a #ffffff Text on seq-5.

Map base

TOKEN LIGHT DARK HIGH
CONTRAST USAGE

map-land #f1f4f3 #11222f #f2f4f6 Muted base-map land ground. Style agency GIS base layers to these
map-* tokens so data layers stand out.

map-water #cfe3ee #0e3347 #cfe0ec Muted base-map water.

map-park #dcebdc #12332a #d8e8d8 Muted base-map parks and open land.

map-road #ffffff #1c3547 #ffffff Base-map roads. Decorative, low contrast on purpose.

map-boundary #7d8d9a #6b8396 #2a3947 Jurisdiction and county boundaries on the map (3:1 on map-land).

map-label #3d4f5e #c4d2dd #00111f Base-map and feature labels on map-land, map-water and map-park.
 12EPMP Design System · TechSur Solutions · November 2026

CHAPTER 06
Contrast verification

Computed from the token values with the WCAG 2 contrast formula, for every theme. Gold (accent) is under 3:1 on white, so

it is only ever a fill carrying dark text, never a lone mark.

Text pairs (4.5:1 minimum, 7:1 in high contrast)

FOREGROUND GROUND LIGHT DARK HIGH CONTRAST

ink on bg 14.5:1  Pass
min 4.5 15.5:1  Pass
min 4.5 19.1:1  Pass
min 7

ink-muted on bg 6.8:1  Pass
min 4.5 8.4:1  Pass
min 4.5 11.8:1  Pass
min 7

ink-muted on bg-sunken 6.0:1  Pass
min 4.5 8.9:1  Pass
min 4.5 9.8:1  Pass
min 7

brand-text on bg 6.3:1  Pass
min 4.5 10.0:1  Pass
min 4.5 10.7:1  Pass
min 7

on-brand on brand 5.0:1  Pass
min 4.5 7.9:1  Pass
min 4.5 9.1:1  Pass
min 7

on-accent on accent 7.8:1  Pass
min 4.5 7.8:1  Pass
min 4.5 10.7:1  Pass
min 7

ink-inverse on bg-inverse 14.5:1  Pass
min 4.5 12.4:1  Pass
min 4.5 19.1:1  Pass
min 7

info-text on info-subtle 7.3:1  Pass
min 4.5 6.8:1  Pass
min 4.5 9.6:1  Pass
min 7

success-text on success-subtle 7.1:1  Pass
min 4.5 7.2:1  Pass
min 4.5 10.0:1  Pass
min 7

warning-text on warning-subtle 6.7:1  Pass
min 4.5 8.2:1  Pass
min 4.5 9.3:1  Pass
min 7

danger-text on danger-subtle 7.0:1  Pass
min 4.5 7.4:1  Pass
min 4.5 9.6:1  Pass
min 7

on-danger on danger-solid 6.5:1  Pass
min 4.5 6.0:1  Pass
min 4.5 9.4:1  Pass
min 7

on-success on success-solid 6.6:1  Pass
min 4.5 7.4:1  Pass
min 4.5 9.8:1  Pass
min 7

on-info on info-solid 6.5:1  Pass
min 4.5 6.1:1  Pass
min 4.5 10.3:1  Pass
min 7

on-seq-4 on seq-4 5.0:1  Pass
min 4.5 6.5:1  Pass
min 4.5 7.9:1  Pass
min 7

map-label on map-land 7.7:1  Pass
min 4.5 10.5:1  Pass
min 4.5 17.3:1  Pass
min 7
 13EPMP Design System · TechSur Solutions · November 2026

Non-text pairs: borders, focus, marks (3:1 minimum)

FOREGROUND GROUND LIGHT DARK HIGH CONTRAST

border-strong on bg 3.4:1  Pass
min 3 4.6:1  Pass
min 3 11.8:1  Pass
min 3

focus-ring on bg 6.3:1  Pass
min 3 9.7:1  Pass
min 3 10.3:1  Pass
min 3

brand on bg 5.0:1  Pass
min 3 8.6:1  Pass
min 3 9.1:1  Pass
min 3

danger-solid on bg 6.5:1  Pass
min 3 6.4:1  Pass
min 3 9.4:1  Pass
min 3

success-solid on bg 6.6:1  Pass
min 3 8.2:1  Pass
min 3 9.8:1  Pass
min 3

info-solid on bg 6.5:1  Pass
min 3 6.8:1  Pass
min 3 10.3:1  Pass
min 3

viz-1 on bg 5.2:1  Pass
min 3 6.6:1  Pass
min 3 7.4:1  Pass
min 3

viz-3 on bg 4.6:1  Pass
min 3 8.7:1  Pass
min 3 7.0:1  Pass
min 3

viz-5 on bg 3.8:1  Pass
min 3 9.0:1  Pass
min 3 6.4:1  Pass
min 3

map-boundary on map-land 3.1:1  Pass
min 3 4.1:1  Pass
min 3 10.7:1  Pass
min 3
 14EPMP Design System · TechSur Solutions · November 2026

CHAPTER 07
Typography

Lato (400 and 700) for all UI text, IBM Plex Mono for identifiers, timestamps and log lines. Minimum text size 12px. Each style

is also a CSS class of the same name.

sans: "Lato", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace

Display

display

40px / 48px · 700 · -0.02em Ready

Page-level hero numbers or titles on executive briefings only. One per view.

h1

32px / 40px · 700 · -0.015em Riverbend flood response, Operational Period 2

Page title. One h1 per page.

h2

24px / 32px · 700 · -0.01em Riverbend flood response, Operational Period 2

Section title.

h3

20px / 28px · 700 · -0.005em Riverbend flood response, Operational Period 2

Card and panel title.

h4

16px / 24px · 700 Riverbend flood response, Operational Period 2

Sub-section and dense panel title.

Text

body-lg

16px / 24px · 400 Riverbend flood response, Operational Period 2

Long-form reading, plan text, AI summaries, and all field-mobile body copy.

body

14px / 20px · 400 Riverbend flood response, Operational Period 2

Default UI text: tables, forms, lists, panels.

body-strong

14px / 20px · 700 Riverbend flood response, Operational Period 2

Emphasis inside body text and table row titles.

label

13px / 16px · 700 Riverbend flood response, Operational Period 2

Form labels, button text, tab labels, badge text.

caption

12px / 16px · 400 Riverbend flood response, Operational Period 2

Helper text, timestamps, source lines. 12px is the minimum size.

overline

12px / 16px · 700 · 0.08em INCIDENT TIMELINE

Eyebrow above a section title. Uppercase.
 15EPMP Design System · TechSur Solutions · November 2026

Data

code

13px / 20px · 400 Riverbend flood response, Operational Period 2

Identifiers, API paths, JSON, log lines, incident numbers.

data

14px / 20px · 400 Riverbend flood response, Operational Period 2

Aligned numerals and timestamps in dense tables.
 16EPMP Design System · TechSur Solutions · November 2026

CHAPTER 08
Spacing, shape and elevation

Spacing (4px base)

TOKEN VALUE USAGE

space-1 4px Icon-to-text gap, tight inline gaps.

space-2 8px Gap between related controls; compact padding.

space-3 12px Input vertical padding, card header gap.

space-4 16px Default padding and gap; card padding on mobile.

space-5 20px Gap between form fields.

space-6 24px Card padding on desktop; gap between cards.

space-8 32px Section gap inside a page.

space-10 40px Gap between page sections.

space-12 48px Page top padding on desktop.

space-16 64px Large vertical rhythm, empty-state padding.

space-20 80px Hero spacing, rarely used.

Radius

TOKEN VALUE USAGE

radius-sm 4px Badges, tags, table cells focus, checkboxes.

radius-md 6px Buttons, inputs, selects, tabs.

radius-lg 10px Cards, panels, alerts, popovers.

radius-xl 16px Modals, large surfaces.

radius-full 9999px Pills, avatars, switches, status dots.

Shadows (overlays only)

TOKEN VALUE USAGE

shadow-sm 0 1px 2px #0f2b4314 Hover lift on interactive cards only.

shadow-md 0 4px 12px #0f2b4318 Popovers, menus, dropdowns.
 17EPMP Design System · TechSur Solutions · November 2026

TOKEN VALUE USAGE

shadow-lg 0 12px 32px #0f2b4326 Modals and drawers. Nothing else casts a shadow.

Sizes

TOKEN VALUE USAGE

control-sm 28px Compact button/input height in dense desktop tables.

control-md 36px Default control height on desktop.

control-lg 44px Minimum touch target. Default for field-mobile controls.

icon-sm 16px Inline icons beside body text.

icon-md 20px Default icon in buttons and nav.

icon-lg 24px Standalone icons and empty-state glyphs.

nav-width 240px Expanded side navigation.

nav-width-collapsed 64px Collapsed side navigation.

content-max 1200px Maximum content width on dashboards.

reading-max 720px Maximum line length for plans, SOPs and AI text.

Borders

TOKEN VALUE USAGE

border-1 1px Default border and divider width.

border-2 2px Selected state, focus ring width, emphasis rule.
 18EPMP Design System · TechSur Solutions · November 2026

CHAPTER 09
Motion, layers and breakpoints

Duration

TOKEN VALUE USAGE

duration-fast 120ms Hover, press, focus, toggles.

duration-base 200ms Menus, tabs, expanding rows.

duration-slow 320ms Modals, drawers, page-level transitions.

Easing

TOKEN VALUE USAGE

ease-standard cubic-bezier(0.2, 0, 0, 1) Entering and moving elements.

ease-exit cubic-bezier(0.4, 0, 1, 1) Elements leaving the screen.

Z-index

TOKEN VALUE USAGE

z-base 0 Normal flow.

z-sticky 100 Sticky headers and table headers.

z-dropdown 200 Menus and popovers.

z-overlay 300 Scrim.

z-modal 400 Modals and drawers.

z-toast 500 Toasts and tooltips.

Breakpoints

TOKEN VALUE USAGE

bp-sm 640px Phone landscape and up.

bp-md 768px Tablet portrait; navigation collapses below this.

bp-lg 1024px Laptop; two-column layouts begin.

bp-xl 1280px Desktop; three-column operating-picture layouts.

Opacity

TOKEN VALUE USAGE

opacity-disabled 0.5 Disabled controls.

opacity-hover 0.08 State layer for hover on ghost surfaces.
 19EPMP Design System · TechSur Solutions · November 2026

TOKEN VALUE USAGE

opacity-hazard 0.28 Fill opacity of hazard and impact areas drawn over a map; the outline carries the 3:1 contrast.
 20EPMP Design System · TechSur Solutions · November 2026

CHAPTER 10
Iconography

One stroke set: 24px grid, 1.75px stroke, round caps, currentColor, rendered at 16, 20 or 24px. Icons support a word; they

never replace it, except in IconButton which requires a label. No emoji, no filled or multicolor icons, no second family.

check x alert info danger chevron-down

chevron-right chevron-left plus minus search menu

bell map users shield file clock

wifi-off refresh sparkle send sliders home

layers flag broadcast truck arrow-up arrow-down

external eye lock trash edit filter

calendar dots crosshair maximize map-pin
 21EPMP Design System · TechSur Solutions · November 2026

CHAPTER 11
Components

40 components. Use these first; build nothing new until none fits.

FOUNDATIONS

Icon FOUNDATIONS

One inline-SVG icon set: 24px grid, 1.75px round stroke,  currentColor , no fill. Pick  name  from  Icon.names ; sizes  sm  (16), default (20),

lg  (24).

Provide: a  name . Pass  label  only when the icon stands alone and carries meaning; otherwise it is  aria-hidden  and the adjacent text

carries the meaning.

Use icons to support a word, never to replace it, except in  IconButton  (which requires a  label ).

Status meaning always pairs an icon with a word:  check  success,  alert  warning,  danger  critical,  info  information.

Never add emoji or a second icon family. If a glyph is missing, compose it from the same stroke rules and add it to  Icon .
 22EPMP Design System · TechSur Solutions · November 2026

ACTIONS

Button ACTIONS

The only element for actions that change something. Variants:  primary  (one per view region),  secondary  (default for other actions),  ghost
(tertiary, in toolbars and cards),  danger  (destructive, always behind a confirm). Sizes  sm  28px, default 36px,  lg  44px (all field-mobile

controls).

Provide: a verb-first label as  children  ("Activate EOC", "Send for approval"). Optional  icon ,  iconRight ,  loading ,  block ,  disabled .

One  primary  per card or page region. Two primaries means one is wrong.

Label with the outcome, not "Submit" or "OK". Sentence case.

loading  keeps the label width stable and disables the button; follow it with a toast or inline result.

Use  <a> /router links for navigation; Button is for actions.

IconButton ACTIONS

A square, icon-only button for toolbars and dense rows.  label  is required; it becomes the accessible name and the native tooltip.

Provide:  icon  (a name from  Icon.names ),  label , optional  size  ( sm , default,  lg ).

Wrap in  Tooltip  when the meaning is not obvious from the icon alone.

Keep a 44px hit area on touch: use  size="lg"  in field-mobile layouts.

Do not use for the primary action of a view; use  Button  with a label.
 23EPMP Design System · TechSur Solutions · November 2026

FORMS

Checkbox FORMS

Independent yes/no choice, or one of several selectable options. 16px box (24px with  size="lg"  for touch), brand fill with a check when on.

Provide:  label ,  checked / onChange  (or  defaultChecked ), optional  disabled ,  size .

The label is the clickable area; phrase it as the true state ("Send acknowledgment receipts").

For a setting that applies immediately, use  Switch . For mutually exclusive options,  Radio .
 24EPMP Design System · TechSur Solutions · November 2026

Combobox FORMS

Searchable single-select dropdown (ARIA combobox with listbox). Type to filter, Up/Down to move, Enter to choose, Escape to close; options
may carry a  hint  line. Use it where a plain  Select  would hold more than about 15 options or users know the name they are looking for

(jurisdictions, facilities, people, resource types).

Provide:  label ,  options  as  [{value,label,hint?,disabled?}] ,  value / onChange(value, option)  (or  defaultValue ); optional

hint ,  error ,  required ,  clearable ,  placeholder ,  size . For server search pass  onSearch(query) , the already-filtered  options ,
and  loading .

Always label it. The placeholder says what to type ("Search jurisdictions"), never replaces the label.

Show  emptyText  that says what to do next, not just "No results".

Value is the option  value ; free text is never a value. For free text plus suggestions, use  TextField .

5 to 15 fixed options: use  Select . Fewer than 5:  Radio .
 25EPMP Design System · TechSur Solutions · November 2026

DatePicker FORMS

Date entry by typing (YYYY-MM-DD) or from a keyboard-operable calendar popover;  withTime  adds a 24-hour time field and returns  YYYY-

MM-DDTHH:mm . Month grid: Arrow keys move by day and week, PageUp/PageDown change month, Escape closes and returns focus to the field;

today has an outline, the selected day a brand fill; disabled days are dimmed and not focusable.

Provide:  label ,  value / onChange(isoString)  (or  defaultValue ); optional  withTime ,  zone  (shown in the hint, e.g. "ET"),  min ,  max

(ISO dates),  hint ,  error ,  required ,  size .

Typing always works: the calendar is an aid, not the only way in (essential for keyboard, screen-reader and field use).

Values are ISO strings; show them formatted for people ("Nov 14, 2026") in read-only views, never in this field.

Always state the time zone for incident times ( zone ). Never default a time silently.

Invalid or out-of-range input gets an error that says what is allowed, shown on blur.
 26EPMP Design System · TechSur Solutions · November 2026

Radio FORMS

One choice from a short, mutually exclusive set. Group with the same  name  inside a  fieldset  with a  legend .

Provide:  label ,  name ,  value ,  checked / onChange  (or  defaultChecked ).

2 to 5 options, all visible. More:  Select .

Pre-select the safest default only when one exists; never pre-select a consequential choice.

Select FORMS

Native select styled to match  TextField . Use native behavior on purpose: it is accessible and works on every field device.

Provide:  label ,  options  as  [{value,label}]  (or  <option>  children),  value / onChange , optional  hint ,  error ,  required .

Use for 5 to 15 mutually exclusive options. Fewer:  Radio . More, or searchable: a combobox pattern (not in this set yet).

Order options logically (severity high to low, alphabetical for names). Never put a placeholder option as a real value.
 27EPMP Design System · TechSur Solutions · November 2026

Switch FORMS

An on/off setting that takes effect immediately. Rendered as  role="switch" , 36x20px.

Provide:  label  and  checked / onChange  (or  defaultChecked ).

Label states the setting, not the action ("Offline sync", not "Turn on offline sync").

If the change needs a Save button or has consequences, use a  Checkbox  inside a form instead.
 28EPMP Design System · TechSur Solutions · November 2026

TextField FORMS

Labelled text input or textarea ( multiline ). Label above, helper text and error below, 36px tall ( size="lg"  44px for field mobile).

Provide:  label  (always),  value / onChange , optional  hint ,  error  (string),  required ,  multiline , and any native input props ( type ,

placeholder ,  inputMode ).

Label every field; a placeholder is an example, never a label.

Write errors as what to do: "Enter a date after the incident start." Show them on blur or submit, not on first keystroke.

Mark required fields with  required ; say "(optional)" in the label for the rest only when most fields are required.

Disabled fields still show their value; explain why in  hint .
 29EPMP Design System · TechSur Solutions · November 2026

FEEDBACK

Alert FEEDBACK

Inline message tied to the content around it. Tones  info ,  success ,  warning ,  danger ,  neutral ; icon and tone color come together.

danger  and  warning  use  role="alert" .

Provide:  title  (short outcome) and  children  (one or two sentences: what happened, what to do), optional  actions  (Buttons),

onDismiss .

Place it where the problem is: top of the form or card, not a distant corner.

Persist errors and warnings until resolved; allow dismissing only  info  and  success .

For transient confirmations use  Toast .

Badge FEEDBACK

Compact status or category label. Tones:  neutral ,  brand ,  info ,  success ,  warning ,  danger . Success, warning, danger and info include

an icon automatically so meaning never relies on color;  solid  is reserved for  danger  and  warning  that need top priority.

Provide: short  children  text (1 to 3 words). Optional  tone ,  icon  (name or  false ),  solid .

Always a word, never color alone. Use the same word for the same state everywhere (Active, Monitoring, Closed).

Do not use Badge for actions or counts in navigation; use the  Tabs  count.

Incident severity map: Critical  danger solid , Elevated  warning , Watch  info , Normal  success .
 30EPMP Design System · TechSur Solutions · November 2026

EmptyState FEEDBACK

What a list, table or panel shows when there is nothing to show. A 48px icon disc, a title, one sentence and at most one action.

Provide:  title , optional  icon ,  children  (explain why and what next),  action  (a Button).

Distinguish first-use ("No incidents yet"), filtered-out ("No tasks match") and error states; each gets different copy.

The action is the obvious next step. No illustrations or humor.

Progress FEEDBACK

Determinate progress bar (8px, pill) with optional label and value.  tone  for  success ,  warning ,  danger .

Provide:  value  (0 to 100), optional  label ,  showValue ,  tone .

Use for measurable work (plans reviewed, sync). For unknown duration use a  Button   loading  spinner or  Skeleton .

Always show the number when the bar is a measure, not decoration.
 31EPMP Design System · TechSur Solutions · November 2026

Skeleton FEEDBACK

Placeholder block shown while content loads. Matches the final layout's size; pulses gently (stops with reduced motion).

Provide:  w ,  h , optional  circle .

Use skeletons for loads over 300ms in lists, tables and cards. Do not use for actions: use  loading  on  Button .

Replace all skeletons at once to avoid layout shift.

LAYOUT

Card LAYOUT

The single container for grouped content: 1px border, 10px radius, no shadow at rest. Optional header ( title ,  subtitle ,  actions ) and

footer ;  interactive  adds hover border and focus for a whole-card link.

Provide:  children ; optional  title ,  subtitle ,  actions ,  footer ,  padded={false}  (for tables or lists that go edge to edge),

interactive .

Separate cards with  space-6  (24px) gaps. Do not nest a card in a card; use a divider or  bg-subtle  panel.

Never add a colored side border or gradient. Emphasis comes from a Badge or Alert inside the card.
 32EPMP Design System · TechSur Solutions · November 2026

DATA

Avatar DATA

Initials in a circle (32px,  lg  44px) for a person. Name is the accessible label.

Provide:  name , optional  size .

Initials only; do not use photos or generated faces. Pair with the person's name and role in text; never alone in a table.

Stat DATA

A single KPI: overline label, 32px value, optional delta with arrow icon and a word of context.  trend  is  good ,  bad  or  flat  (meaning, not

direction: a falling response time is  good ).

Provide:  label ,  value , optional  delta  (string beginning + or -),  trend ,  hint .

Show a definition, baseline and period nearby (KPI standards). Never invent targets.

At most 4 per row. Do not decorate with charts inside the tile.
 33EPMP Design System · TechSur Solutions · November 2026

Table DATA

Dense, scannable data. Sticky uppercase header on  bg-subtle , 1px row rules, hover row tint,  selectedKey  row on  brand-subtle .
Numbers right-aligned with tabular figures.

Provide:  columns  as  [{key,header,align?,width?,render?(row)}] ,  rows ,  rowKey , optional  selectedKey ,  onRowClick ,  compact ,

caption  (screen-reader title).

Status columns render a  Badge , never plain colored text.

Max one line per row; truncate nothing that carries a decision. Link the first column to the record.

Include loading ( Skeleton  rows), empty ( EmptyState ) and error ( Alert ) variants in every real screen.
 34EPMP Design System · TechSur Solutions · November 2026

Timeline DATA

Chronological activity log for an incident: monospaced time, a status dot, title, meta line. Dot tones  brand ,  success ,  warning ,  danger .
Append-only; newest at the top on the operating picture, oldest first in reports.

Provide:  items  as  [{time,title,meta?,tone?,children?}] .  time  in the incident's time zone, 24-hour.

Every entry names an actor and a source. AI actions say so in  meta .

Never edit history; add a correcting entry.

NAVIGATION

Breadcrumbs NAVIGATION

Shows the path to the current page. Muted links, chevron separators, current page in bold with  aria-current="page" .

Provide:  items  as  [{label,href?}] ; the last item is the current page and not a link.

Use on any page 3 or more levels deep. Keep each label identical to the destination page's title.
 35EPMP Design System · TechSur Solutions · November 2026

PageHeader NAVIGATION

Top of every page: breadcrumbs, one  h1  (32px), optional subtitle and status, and a single actions group at right with the primary action last.

Provide:  title , optional  crumbs ,  subtitle ,  status  (a Badge),  actions .

Exactly one  h1  per page. Actions are the page-level ones only; row actions live in the row.

SideNav NAVIGATION

Primary navigation: 240px (64px collapsed under  bp-md ),  bg-subtle  rail, brand mark, grouped items, current page in  brand-subtle . Items

follow the lifecycle: Prepare, Monitor, Activate, Coordinate, Recover, Improve.

Provide:  groups  as  [{label?,items:[{id,label,icon,href}]}] ,  current  (item id), optional  brand .

6 to 9 items. One level only. Labels are nouns for locations ("Incidents", "Plans").

Field mobile replaces it with a bottom bar of 4 destinations.
 36EPMP Design System · TechSur Solutions · November 2026

Tabs NAVIGATION

Switches between views of the same object. 2px brand underline on the selected tab; Left/Right arrows move between tabs. Pair with panels
having  role="tabpanel" .

Provide:  tabs  as  [{id,label,count?}] ,  value ,  onChange .

2 to 6 tabs, short labels. They change content, not location: use the nav for locations.

Keep the same tab order across incidents.

OVERLAYS

Modal OVERLAYS

A focused task or confirmation that blocks the page. 480px max, 16px radius, the only large shadow, scrim behind. Focus moves in, Escape

closes, focus returns to the trigger.  danger  switches to  alertdialog .

Provide:  open ,  title ,  children ,  footer  (Buttons, primary last and rightmost),  onClose ; optional  width ,  danger .

Title states the decision ("Close Riverbend flood?"); body states the consequence; buttons name the outcomes ("Close incident" / "Keep
open"), never "Yes/No".

Use for one decision. Longer flows get a page. Never stack modals.
 37EPMP Design System · TechSur Solutions · November 2026

Toast OVERLAYS

Transient confirmation after an action, bottom-left of the viewport (bottom-center on mobile). Inverse surface; stays 6 seconds, longer if it has
an action;  danger  toasts do not auto-dismiss.

Provide:  children  (one sentence), optional  tone ,  title ,  action  (ghost Button, usually Undo),  onDismiss .

Say what happened, past tense: "Alert sent to 412 recipients."

Never use a toast for errors the user must fix: use  Alert  inline.

Tooltip OVERLAYS

Short, non-essential hint on hover and focus. Inverse surface, 12px text, one line, no interactive content.

Provide:  label  and one focusable child as  children .

Only supplement what is already labeled (an icon button, an abbreviation). Never hold information required to complete a task.

Touch has no hover: put anything essential in visible text.
 38EPMP Design System · TechSur Solutions · November 2026

PRODUCT PATTERNS

AIDraft PRODUCT PATTERNS

The only way AI output reaches a person. It is always labelled, never issued automatically, shows its sources, and requires a named person to
approve, edit or discard. Pairs with the human-approval rule: no AI message becomes a public warning, evacuation instruction or binding

resource decision without review.

Provide:  children  (the draft text),  sources  ( Provenance  chips),  onApprove ,  onEdit ,  onDiscard ; optional  title ,  model ,  note .

The "Not issued" badge stays until Approve is pressed. Approving records the reviewer and time in the Timeline.

Never style AI text to look final. Never auto-fill an official field with a draft; insert only on Approve.

Low confidence or missing sources: say so in the body; do not hide the draft.

Provenance PRODUCT PATTERNS

A chip that shows where a fact came from: source, time, verification, optional confidence. Dashed outline plus an alert icon and the word

"Unverified" for feeds not yet validated.

Provide:  source , optional  time ,  verified  (default true),  confidence  (short text).

Attach to every ingested or AI-derived fact. Never turn an unverified feed into a plain operational fact: it keeps the dashed chip until a
person validates it.
 39EPMP Design System · TechSur Solutions · November 2026

SyncStatus PRODUCT PATTERNS

Connection and sync state for degraded-mode operation:  online ,  syncing ,  offline  (with queued count in  detail ),  conflict . Each
has an icon and a word.

Provide:  state , optional  detail .

Visible in the app header and on every mobile screen. When  offline , all edits stay possible; show queued counts and reconcile on

reconnect; conflicts always go to a person.
 40EPMP Design System · TechSur Solutions · November 2026

DATA VISUALIZATION

BarChart DATA VISUALIZATION

Compare quantities across categories: vertical or  horizontal  (best for long labels), grouped or  stacked . Bars are 2px-rounded, values are
printed on or beside the bar, stacked segments are separated by a  bg  gap, and  patterns  adds stripe, dot and hatch fills so series survive print

and grayscale; a hidden data table repeats the data.
 41EPMP Design System · TechSur Solutions · November 2026

Provide:  label ,  categories ,  series  as  [{name,values:[...]}] , optional  title ,  subtitle ,  stacked ,  horizontal ,  patterns ,

format ,  yMax ,  height ,  labelWidth ,  xName .

Sort categories by value unless they have a natural order (time, severity).

Print the values; do not make people read them off the axis.

Turn on  patterns  when the chart will be printed, projected, or shown in the  contrast  theme.

Use  horizontal  when any label is over about 10 characters.

DonutChart DATA VISUALIZATION

Part-to-whole for 2 to 5 segments, with a center total, a list legend with values and percentages, and a hidden data table. Segments take  viz
colors, or pass  tone  ( success ,  warning ,  danger ,  info ) when segments are statuses; separation is a gap, not outline color.

Provide:  label ,  segments  as  [{label,value,tone?}] , optional  center  as  {value,label} ,  title ,  subtitle ,  format ,  size .

Only for parts that add to a meaningful whole. Never for trends or more than 5 segments: use  BarChart .

Values and percentages are always listed; the ring alone is never the only carrier of information.

Order segments by size, largest first, or by status severity.
 42EPMP Design System · TechSur Solutions · November 2026

Heatmap DATA VISUALIZATION

A matrix of values (rows by columns) shaded with the 5-step teal ramp  seq-1 .. seq-5 ; every cell prints its value in the paired  on-seq-*
color, so the shading is never the only signal. Missing data is a dashed-neutral cell reading "No data", not zero. A low-to-high legend sits below.

Provide:  label ,  rows ,  cols ,  values  (matrix,  null  for missing), optional  title ,  subtitle ,  format ,  min ,  max .

Use for patterns across two dimensions (readiness by region and function); use a  Table  when exact lookup matters more than pattern.

Fix  min  and  max  when comparing several heatmaps so the shading means the same thing.

Keep to about 8 rows by 8 columns; more becomes a table.
 43EPMP Design System · TechSur Solutions · November 2026

LineChart DATA VISUALIZATION

Trends over time or ordered categories, up to 6 series. Series get color from  viz-1 .. viz-6 , a different marker shape each (circle, square,
triangle, diamond, cross) so they stay distinct without color; hover or Left/Right arrows show an exact readout; a legend shows each series'

latest value; a hidden data table repeats the data for screen readers.

Provide:  label  (what the chart shows, used as accessible name),  series  as  [{name,values:[...],dashed?}]  (use  null  for gaps),

xLabels , optional  title ,  subtitle ,  format ,  yMin ,  yMax ,  height ,  thresholds  as  [{value,label}] ,  xName .

One question per chart; at most 6 series. More: small multiples.

Y axis starts at zero unless  yMin  is justified in the subtitle.

Mark targets or limits with  thresholds  (dashed, labelled), not a color band.

Never rely on hue alone: keep the marker shapes; use  dashed  for projected data.
 44EPMP Design System · TechSur Solutions · November 2026

Sparkline DATA VISUALIZATION

A 120x32 trend line with an end dot, for tables and  Stat  tiles. No axes, no labels: it shows direction only, so always put the current value and a
time frame beside it.  tone  for  success ,  warning ,  danger  or  info ; default is  brand .

Provide:  values , optional  label  (accessible name),  tone ,  width ,  height .

Pair with a number; a sparkline is never the only evidence.

Do not color a sparkline red or green by direction alone: color it only when the metric has a defined good or bad range.

MAPS

LayerPanel MAPS

A checklist of map layers that always shows each layer's source and data age, plus an "Unverified" flag where relevant. It is how provenance

reaches the map: users see what each layer is, who supplies it and how fresh it is before they trust it.

Provide:  layers  as  [{id,label,source,asOf?,verified?,count?,checked}] ,  onToggle(id, checked) ; optional  title ,  onClose .

Order layers by importance to the current task; incidents first, reference layers last.

Unverified feeds are off by default.

4 to 8 layers; more become groups.
 45EPMP Design System · TechSur Solutions · November 2026

MapCanvas MAPS

The map surface and its overlay language. In production, put the agency's own GIS base layer (Esri, OSM-derived, MapLibre) under it and style
that base with the  map-*  tokens (muted land, water, roads, labels);  MapCanvas  then draws EPMP data on top and provides the control,

legend, popup and status-bar slots. With no tiles (offline or degraded mode) it renders a schematic base so the operating picture stays usable,
and says so ( offline ).

Provide:  height ,  markers  as  [{id,x,y,type,tone,label,status}]  with x,y 0 to 100 (percent of the canvas; map your projection to
these or replace with your engine's overlay),  areas  as  [{id,points,tone,label}] ,  lines  as  [{id,points,kind,dashed}] ,

selectedId ,  onSelect(id) , slots  topLeft ,  topRight ,  bottomLeft ,  popup , and  status ,  attribution ,  offline ,  label .

basemap={false}  for transparent over a real base.

Marker types differ by SHAPE (incident diamond, facility square, resource triangle, shelter circle) and tone by status, all outlined in  ink  for 3:1

against any base; selection adds a  focus-ring  halo. Hazard areas use the tone with  opacity-hazard  fill and a solid 2px outline. Every
marker is keyboard focusable and also listed in a hidden text list.

One accent color family per map layer; never more than 6 layers visible without a layer panel.

Show data age ("As of 08:14") in  status . Unverified layers are labelled in  LayerPanel .

Never place text over a marker without the halo; labels use  ep-map-label .
 46EPMP Design System · TechSur Solutions · November 2026

MapControls MAPS

A vertical stack of icon buttons for zoom, location, layers and full screen, in one bordered group. Pass only the handlers you support; buttons
without a handler are not shown (zoom is always shown).

Provide:  onZoomIn ,  onZoomOut ; optional  onLocate ,  onLayers  with  layersOpen ,  onFullscreen .

Place top-right inside  MapCanvas  ( topRight ). Each button is 36px (use a wider hit area on mobile via the page layout, never smaller).

Keep zoom operable by keyboard (+ and - keys in your map engine) as well as by these buttons.

MapLegend MAPS

Explains the symbols on the map: marker glyphs (shape plus tone), hazard areas, and lines. Always visible in the operating picture, collapsible on

mobile.

Provide:  items  as  [{kind:'marker'|'area'|'line'|'boundary',type?,tone?,dashed?,label}] , optional  title .

Use exactly the glyphs the map draws. List only what is currently visible.

Marker types by shape: incident (diamond), facility (square), resource (triangle), shelter (circle). Tone follows status ( danger ,  warning ,

success ,  info ,  brand ).
 47EPMP Design System · TechSur Solutions · November 2026

MapPopup MAPS

A compact card for the selected map feature: name, status  Badge , key facts,  Provenance  of the data and one or two actions. Anchor it
bottom-center inside  MapCanvas  via the  popup  slot (or beside the feature in your map engine).

Provide:  title ,  children  (2 to 3 facts), optional  badge ,  provenance ,  actions ,  onClose .

Keep it to what the user needs to decide; link to the full record for the rest.

Status is a  Badge  with icon and word, never color alone.
 48EPMP Design System · TechSur Solutions · November 2026

CHAPTER 12
Page patterns

Compose pages from components in these arrangements. All pages sit on  bg , content max  content-max  (1200px), page

padding  space-6  ( space-4  on mobile), sections separated by  space-8 .

App shell

SideNav  (240px) at left, header strip at top (breadcrumbs, global search,  SyncStatus , alerts  IconButton , user  Avatar ),

content to the right. Under  bp-md  the nav collapses to a bottom bar of 4 destinations and the header keeps  SyncStatus  and

the incident name. The header is 56px,  bg , with a  border  bottom rule.

Dashboard (EOC / executive)

PageHeader , then a row of up to 4  Stat  tiles, then a 12-column grid of  Card s (8/4 or 6/6). The operating-picture map takes

the widest card; its side panel lists  Timeline  and tasks. Executive briefing views use  display  for 1 to 3 headline numbers

and nothing else decorative. Every number shows its definition, period and source on hover or in  caption .

Incident workspace

PageHeader  with the incident name, a severity  Badge  and Generate SITREP (secondary) plus New task (primary). Below:

Tabs  for Timeline, Tasks, Resources, Reports. Left two-thirds is the active tab; right third is a pinned  Card  with command

roles and the map thumbnail. New entries append to the  Timeline  with actor and source. Changing the incident's activation
level opens a  Modal  that states the consequence.

Lists and tables

Table  inside a  Card padded={false} , with a toolbar above (search  TextField , filter  Select s, count in  caption ,

primary action at right). Link the first column. Selected row  brand-subtle . Bulk actions replace the toolbar when rows are
selected. Page with 25 rows; show "1 to 25 of 140". Loading shows 6  Skeleton  rows, empty shows  EmptyState , error

shows a  danger   Alert  above the table with Retry.

Forms

Single column, max 560px,  space-5  between fields, labels above, hint under the label's field, errors below. Group related

fields under an  h4 . Footer: primary at right, secondary left of it, Cancel as  ghost . Validate on blur and on submit; on submit

with errors move focus to the first error and show a  danger   Alert  summarising the count. Never clear a form on error. Long

forms (ICS) are split into steps of 5 to 8 fields with  Progress ; autosave drafts and show "Saved 08:41".

Field mobile

Single column,  body-lg , all controls  size="lg"  (44px), 24px checkboxes, bottom action bar with one primary Button,

SyncStatus  pinned at top. Offline: every edit works, shows "Queued", and reconciles with a  Timeline  entry on reconnect.

Photo and location capture are one tap with a visible confirmation. Avoid hover-only UI and gestures without a button
equivalent.
 49EPMP Design System · TechSur Solutions · November 2026

Operating picture (map)

MapCanvas  at 8 of 12 columns,  MapControls  top-right,  LayerPanel  opened from the controls,  MapLegend  bottom-left,

MapPopup  for the selected feature, status bar with data age. Right column holds the incident  Timeline  and task list. Details

in  maps.md .

Analytics and reporting

A  PageHeader , a  Stat  row, then  Card s each holding one chart with title, subtitle (unit, period, source) and a data table
alternative. Rules in  data-visualization.md . Date ranges use two  DatePicker s; people and places use  Combobox .

Notifications and alerts

Compose in this order: audience (groups, geotarget map), message (template,  TextField  multiline, character count), review

(read-only preview, delivery channels, who approves), approve and send. Public warning, evacuation or any external send is
approval-controlled by a named person;  AIDraft  can fill the message but never send. After sending, the delivery view is a

Table  with status  Badge s and acknowledgment  Progress .

AI assistance

Place AI where the work is: a "Draft with AI" secondary Button on a form or report, which inserts an  AIDraft  panel below
with sources as  Provenance  chips. Approve inserts the text into the field and logs reviewer and time; Discard removes it. The

conversational assistant (later phase) answers only from permitted sources and always shows citations. Never show AI

confidence as a bare percentage; say "High", "Medium", "Low" with the reason.

Interoperability and integration health

Integration status is a  Table : system, last sync, direction, record authority (which system owns the record),  SyncStatus .

Conflicts are listed with both values side by side and two buttons: "Keep EPMP value", "Keep WebEOC value". Never silently

overwrite.

Empty, loading, error

Empty first-use:  EmptyState  with the one action that starts the work. Filtered-out: say what filter caused it, with "Clear

filters". Loading:  Skeleton  at the final layout size. Error: inline  Alert  with cause and Retry; keep the last known data visible

and label its age ("As of 08:14").

Responsive rules

Mobile first. Grids collapse to one column below  bp-md ; tables become cards with label and value pairs under  bp-sm . Touch

targets 44px under  bp-md . Never hide status or  SyncStatus  on small screens. Tooltips are never the only carrier of

information.
 50EPMP Design System · TechSur Solutions · November 2026

CHAPTER 13
Data visualization

Charts answer one question each and are legible in every theme, in print, and without color. Use the chart components; do not

import a charting library or style one by hand.

Chart components

NEED COMPONENT

Trend over time, up to 6 series LineChart

Compare categories, grouped or stacked, vertical or horizontal BarChart

Parts of a whole, 2 to 5 segments DonutChart

Direction beside a number Sparkline

Pattern across two dimensions Heatmap

Single KPI Stat

Progress toward a measurable total Progress

Exact lookup Table

Color

Categorical series use  viz-1  to  viz-6  in order (blue, vermillion, bluish green, reddish purple, amber, neutral). Sequential

data uses  seq-1  to  seq-5  with  on-seq-*  text. Statuses ( success ,  warning ,  danger ,  info ) use the status tokens only

when the data is a status. Never use  accent  (gold) for data. Axes and labels use  ink-muted , grid lines  border .

Never color alone

Line series have different marker shapes; dashed lines mark projections.

Bars: turn on  patterns  for print, projection, grayscale and the  contrast  theme.

Print values on or beside marks; keep the legend with latest values.

Every chart has a  label  (accessible name) and a hidden data table; keep both.

Threshold lines are dashed and labelled in text ( thresholds ), not color bands.

Content

Title states what is measured; subtitle states unit, period and source. Y axis starts at zero unless justified. Label directly rather

than make people look up a legend. Sort by value unless there is a natural order. Show definition, baseline, target and review
cadence for every KPI; never invent targets. AI activity counts are not outcomes: chart decision quality, time saved and error

rates instead. Show data age and provenance on operational charts ("As of 08:14, source: Incident log").
 51EPMP Design System · TechSur Solutions · November 2026

Interaction and states

Hover or Left/Right arrows reveal exact values on  LineChart . Charts have loading ( Skeleton  at the chart size), empty
( EmptyState  with why and what next) and error ( Alert  with Retry, last known data labelled with its age) states. No

animation beyond  duration-slow  fades; none under reduced motion.

Layout

Place a chart inside a  Card  with  title  and  subtitle  in the card header. Minimum width 320px; below  bp-sm  use

BarChart horizontal  or a  Table . Align charts to the 12-column grid; two charts per row at  bp-lg  and up.
 52EPMP Design System · TechSur Solutions · November 2026

CHAPTER 14
Maps

EPMP shows the common operating picture on the agency's own GIS (Esri, OSM-derived layers). The map engine is the

agency's; the design system supplies the base-map style, the overlay symbology and all surrounding controls so the map looks

and behaves like the rest of EPMP.

Components

PART COMPONENT

Map surface, overlay symbology, slots, status bar MapCanvas

Zoom, locate, layers, full screen MapControls

Layer list with source, data age, verification LayerPanel

Symbol key MapLegend

Selected feature card MapPopup

Base map

Style the agency base layer with the  map-*  tokens:  map-land ,  map-water ,  map-park ,  map-road ,  map-boundary

(county lines, dashed),  map-label . Keep it muted so EPMP data is the loudest thing on screen. No imagery or satellite base by

default. In degraded or offline mode,  MapCanvas offline  shows a schematic base and a visible "Schematic base map, offline"

badge.

Symbology

Markers differ by shape and carry status by tone: incident (diamond), facility (square), resource (triangle), shelter (circle). Fill is

the status color ( danger-solid ,  warning-solid ,  success-solid ,  info-solid ,  brand ), outline always  ink  2px so

every marker reaches 3:1 on any base. Selected markers add a  focus-ring  halo. Hazard and impact areas use the tone fill at

opacity-hazard  with a solid 2px outline ( warning-text  for gold). Routes are  brand  3px (dashed when planned). Labels

use  ep-map-label  (halo in  map-land ).

Behavior

Every marker is keyboard focusable (Tab, Enter) and listed in a hidden text list. Provide a table or list alternative to the map
for any task that depends on it.

Selecting a marker opens a  MapPopup ; closing returns focus to the marker.

LayerPanel  shows source and as-of time for each layer; unverified feeds are off by default and labelled "Unverified".

Never present an unverified feed as an operational fact.

Status bar always shows data age and base-layer source ("As of 08:42 ET · Base layer: agency GIS").

Zoom and pan are operable without a pointer (keys in the engine plus  MapControls ).

Do not rely on color to separate layers: shape, outline and label do the work. Keep at most 6 layers visible at once.
 53EPMP Design System · TechSur Solutions · November 2026

Layout

Operating-picture page: map takes 8 of 12 columns at  bp-lg  and up with a right column for  Timeline  and tasks; below  bp-

md  the map is full width with a bottom sheet for the list. Field mobile: map plus a single "Report observation" primary action,

offline-capable, with queued reports shown via  SyncStatus .

Integrating a real map engine

Render the engine (MapLibre, Leaflet, ArcGIS JS) in the same container, set its base style from the  map-*  tokens, draw EPMP
features as the shapes above, and use  MapCanvas basemap={false}  for transparent overlay, or feed the engine's projected

screen positions into marker  x , y  (percent). Keep the controls, legend, popups and status bar from this set.
 54EPMP Design System · TechSur Solutions · November 2026

CHAPTER 15
Accessibility

Target WCAG 2.2 AA and Section 508 for every screen, and the  contrast  theme as an added high-contrast option (text 7:1,

borders 3:1, surfaces separated by borders). EPMP is not claimed as authorized or certified by any program; accessibility

conformance is demonstrated by testing, not asserted.

Contrast

Text 4.5:1 on its ground (3:1 at 24px and above or 19px bold and above). In  contrast , 7:1.

Controls, focus rings, icons and chart marks that carry meaning 3:1. Control borders use  border-strong , never  border .

Pairs already verified in every theme:  ink ,  ink-muted ,  brand-text , each status  -text  on  bg ,  bg-subtle ,  bg-

raised ,  bg-sunken  (and on its  -subtle ); each  on-*  on its fill;  focus-ring  and  border-strong  on all four grounds;

viz-1  to  viz-6  on  bg  and  bg-raised .

accent  (gold) is under 3:1 on  bg : use it only as a fill carrying  on-accent  text or beside text, never as a lone mark.

Disabled elements are exempt but never carry required information.

Color and meaning

Never color alone. Status = icon + word + color ( Badge ,  Alert ,  SyncStatus  do this). Success is bluish green, danger

vermillion. Charts: label series directly, add patterns, shapes or lightness steps, and provide a data table alternative.

Keyboard and focus

Everything operable by keyboard in a logical order. Visible focus: 2px solid  focus-ring , 2px offset, never removed.  Modal

traps focus, closes on Escape, returns focus to the trigger.  Tabs  use Left/Right arrows. Provide skip-to-content as the first

focusable element. No keyboard traps; no hover-only controls.

Touch and motion

Targets at least 44x44px on field-mobile (24px minimum anywhere on desktop, per WCAG 2.2 target size, with spacing). No

gesture without a single-pointer alternative. Respect  prefers-reduced-motion . Nothing flashes more than 3 times a

second.

Structure and semantics

One  h1 , headings in order. Landmarks:  header ,  nav  (labelled),  main ,  footer . Tables have  th scope="col"  and a

caption. Use native elements before ARIA; use  aria-live  ( status ,  alert ) for async updates, sparingly. Language
attribute on  html . Page titles describe the page and the incident name.

Forms

Visible label for every field, programmatically associated; hint and error linked with  aria-describedby ; required indicated

in text; error identified in text with a suggestion and an icon; do not rely on placeholder. Group radios with  fieldset  and

legend . Allow paste and password managers; do not lock fields without explaining why.
 55EPMP Design System · TechSur Solutions · November 2026

Content

Plain language (grade 8 or below for public-facing text). Expand acronyms on first use per page (ICS, COP, AAR). Alt text for
any meaningful image or map: describe the decision it supports; maps always have a text or table equivalent.

Testing checklist

1. Keyboard-only pass of the full flow. 2. Screen reader pass (NVDA/JAWS and VoiceOver) of the primary flow. 3. 200% and

400% zoom, no loss of content. 4. All three themes. 5. Contrast audit including states. 6. Reduced motion. 7. Automated
scan (axe) with zero serious or critical issues. 8. Section 508 test process results recorded for the release.
 56EPMP Design System · TechSur Solutions · November 2026

CHAPTER 16
Content and voice

Voice

Plain, factual, active, calm. We are a dependable operations colleague. Short sentences. Say what happened, what it means,
what to do. No hype, no humor, no exclamation marks, no emoji, no metaphors for danger.

Style rules

Sentence case for all UI text, including buttons, headings, menu items and table headers.

Buttons: verb plus object, outcome-first ("Activate EOC", "Assign resource", "Send for approval"). Cancel and Close are fine;
never "Submit", "OK", "Yes/No".

Headings name the thing ("Open tasks"), not the action. Page titles equal the nav label.

Times are 24-hour with the incident zone (08:42 ET). Dates are "Nov 14, 2026" in text and ISO in data. Numbers use

tabular figures; spell out units.

Errors: cause, then fix. Never blame the user, never use "oops" or "something went wrong". Include the retry or next step.

Empty states: why it is empty, then the one action to start.

AI output always says "Draft" and who must approve. Never write "AI decided" or "AI approved".

Unverified information says "Unverified" and its source. Never present vendor or feed claims as confirmed facts.

Do not claim FedRAMP authorization or certification in product copy.

Terminology

Use these terms consistently; do not invent synonyms.

TERM USE

EOC Emergency operations center. Spell out on first use.

ICS Incident Command System. Roles: Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public
Information.

COP Common operating picture. Prefer "operating picture" in UI.

SITREP Situation report. Spell out "situation report" in headings.

AAR After-action report.

Activation Moving an EOC or incident to Monitoring, Partial or Full.

Resource request A request for people, equipment or supplies. Statuses: Draft, Awaiting approval, Approved, Fulfilled, Declined.

Task A tracked unit of work with an owner and due time. Statuses: Open, In progress, Awaiting approval, Done, Overdue.

Operational
period The planning cycle for an incident (Operational Period 2).

Record authority Which system owns a record (EPMP or an external system).
 57EPMP Design System · TechSur Solutions · November 2026

TERM USE

Provenance Source, time and verification of a fact.

Examples

Good: "Resource request approved: 2 generators for Riverbend Shelter." Bad: "Success! Your request has been approved."

Good: "WebEOC sync failed. 6 updates from 08:14 are queued and will send when the link returns. Retry." Bad: "Oops,

something went wrong." Good (AI): "Draft situation report. Review and approve before it is saved." Bad: "Your AI assistant has
written the report."
 58EPMP Design System · TechSur Solutions · November 2026

CHAPTER 17
Governance

Ownership and change

The design system has one owner and a small review group (design, front end, accessibility). Changes arrive as a request with
the problem, the screens affected and the proposed token or component change. A component is added only if two or more

screens need it and no composition of existing components works. Reviewed changes land together with their README and

preview.

Versioning

Semantic: major for token renames or removals and breaking component props, minor for new tokens or components, patch

for fixes and value tweaks that keep contrast. Record each change in the index note with date and reason. Deprecate before

removing: keep the old token or prop for one minor release and mark it in its usage note.

Tokens

One source:  tokens.json . Names are semantic ( bg-raised ,  danger-text ), never literal ( blue-500 ). Every color has a

value in  light ,  dark  and  contrast , a usage note naming its grounds, and passes the contrast checks listed in

accessibility.md . Add a token only when no existing token carries the meaning. Never reuse a token for a different

meaning.

Quality gate for any new screen

1. Uses only tokens and listed components. 2. Passes the checklist in  llm-build-guide.md . 3. Has loading, empty, error and

offline states where relevant. 4. Verified in all three themes and at mobile and desktop widths. 5. Accessibility checklist

complete.

Open decisions

The official TechSur/EPMP logo is not yet in the system. Not yet built: multi-select combobox, date-range picker, area and

scatter charts, map drawing and measurement tools, and a native map-engine adapter (see  maps.md ). Build them to these
rules when needed and add them here.
 59EPMP Design System · TechSur Solutions · November 2026

CHAPTER 18
LLM build guide

Give an LLM this system by handing it this file plus  README.md ,  tokens.json  (or the compiled  tokens.css ),

components/bundle.js  and  components/bundle.css . The section "Prompt to paste" is the contract.

Prompt to paste

You are building a screen for EPMP, the TechSur Emergency Preparedness & Management Platform. Build ONLY
with the EPMP design system.

Sources of truth, in priority order: the component README for each component you use, README.md (rules),
tokens.json / tokens.css (values), patterns.md (page layouts), data-visualization.md (charts), maps.md
(maps), accessibility.md, content-and-voice.md.

Rules (non-negotiable):
1. Use window.EPMP components first (Button, TextField, Combobox, DatePicker, Card, Table, Badge, Alert,
Tabs, Modal, Timeline, LineChart, BarChart, DonutChart, Heatmap, MapCanvas, LayerPanel, AIDraft, Provenance,
SyncStatus, and the rest). Charts and maps only through the chart and map components. Do not build a new
component if one fits.
2. Use design tokens only: color, spacing, radius, type, shadow, size, z-index, duration through var(--
token) and the type classes (.h1 ... .caption). Never write a hex value, an arbitrary pixel size, a font
name, or a box-shadow.
3. Modern, minimalist, clean: neutral surfaces, one brand teal for the primary action, one gold highlight at
most. No gradients, no card shadows, no colored side borders, no emoji, no stock imagery.
4. One primary Button per region. Verb-first labels in sentence case.
5. Status is always icon + word + color (Badge, Alert, SyncStatus). Never color alone.
6. AI output only through AIDraft with Provenance sources, approved by a named person. Never auto-send
anything AI-generated.
7. Every list, table and panel has loading (Skeleton), empty (EmptyState) and error (Alert) states. Show
offline state with SyncStatus on pages used in the field.
8. Accessibility: WCAG 2.2 AA, visible focus, full keyboard use, labels on every field, 44px touch targets
on mobile (size="lg"), one h1, ordered headings, works in light, dark and contrast themes.
9. Mobile first. Respect breakpoints bp-sm 640, bp-md 768, bp-lg 1024, bp-xl 1280.
10. Do not claim FedRAMP authorization anywhere.

Process: (a) state which pattern from patterns.md you are using; (b) list the components you will use; (c)
build; (d) run the checklist at the end of llm-build-guide.md and report any item you could not satisfy. If
a needed token or component does not exist, say so and propose it; do not improvise values.

Task: <describe the screen, the user's role, the data, the primary action>
 60EPMP Design System · TechSur Solutions · November 2026

Loading the system in a page

<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<script src="react.production.min.js"></script>
<script src="react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
<body data-theme="light">  <!-- light | dark | contrast -->
<div id="root" class="ep"></div>
<script>
  const { PageHeader, Card, Button, Badge } = window.EPMP;
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(PageHeader, { title: 'Incidents', actions: h(Button, null, 'Create incident') })
  );
</script>

Using tokens

CSS:  padding: var(--space-4); background: var(--bg-raised); border: var(--border-1) solid var(--

border); border-radius: var(--radius-lg); color: var(--ink);

Type: apply the class ( class="h2" ,  class="body" ,  class="caption" ) or the same sizes from  tokens.json

type.groups . Mono ( code ,  data  styles) for ids, times and log lines.

Never reference palette values. Pick by meaning:  bg-subtle  for a quiet panel,  danger-text  for error text,  brand-

text  for a link.

Compose layouts with CSS grid or flex using spacing tokens; use  content-max  for the page width and  reading-max  for

text columns.

Mapping intent to components

THE SCREEN NEEDS USE

A grouped panel Card  (padded false for tables)

Page title, crumbs, actions PageHeader

A KPI Stat

Records in rows Table  +  Badge  for status

A history or audit trail Timeline

A form TextField ,  Select ,  Combobox ,  DatePicker ,  Checkbox ,  Radio ,  Switch  in a  Card

Search a long list Combobox

A date or incident time DatePicker  ( withTime ,  zone )

A trend, comparison or share LineChart ,  BarChart ,  DonutChart ,  Sparkline ,  Heatmap

A map with incidents, assets, hazards MapCanvas  +  MapControls ,  LayerPanel ,  MapLegend ,  MapPopup

A destructive confirm Modal danger  with outcome-named buttons
 61EPMP Design System · TechSur Solutions · November 2026

THE SCREEN NEEDS USE

Something to review Alert  (persistent) or  Toast  (confirmation)

Drafted by AI AIDraft  +  Provenance

Connectivity SyncStatus

Nothing here yet EmptyState

A view switch within a page Tabs

Anti-patterns to reject

Hard-coded colors; shadows on cards; gradient or tinted hero banners; colored left borders on cards; third-party chart
themes; color-only chart series; map markers without a shape and outline; emoji or filled icon sets; ghost buttons used as the

only primary action; "Submit"/"OK" labels; placeholder-only fields; status shown as a colored dot alone; tables without header

scope or caption; modals that stack; dark text on  brand  in light theme (use  on-brand ); auto-issued AI messages; vendor or

feed claims shown as verified facts.

Self-check before returning code

[ ] Only tokens and EPMP components; no raw hex, no arbitrary px outside the scale.

[ ] One  h1 ; headings in order; landmarks present.

[ ] One primary Button per region; labels verb-first, sentence case.

[ ] Every status has icon + word.

[ ] Loading, empty, error (and offline where relevant) handled.

[ ] AI content only in  AIDraft  with sources; no auto-send.

[ ] Focus visible, keyboard path complete, labels and errors associated.

[ ] Verified in  light ,  dark  and  contrast ; checked at 375px and 1280px.

[ ] Touch targets 44px on mobile screens.

[ ] Charts have a label, printed values and pattern or shape differences; maps list data age and source.

[ ] Copy follows  content-and-voice.md  and uses its terminology.
