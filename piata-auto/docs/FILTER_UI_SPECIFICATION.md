# Home Screen Filter UI - Visual Design Specification

## 1. Color Palette & Tokens

```
Primary Colors:
  bg-primary        = #2563eb (Blue)
  bg-slate-900      = #0f172a (Dark Navy)
  bg-white          = #ffffff (White)
  bg-slateBg        = #f8fafc (Very Light Gray)

Text Colors:
  text-white        = #ffffff
  text-slate-900    = #0f172a (Dark)
  text-slate-500    = #64748b (Medium Gray)
  text-slate-400    = #94a3b8 (Light Gray)

Border Colors:
  border-slate-200  = #e2e8f0 (Light Border)
  border-primary    = #2563eb

Accent:
  bg-amber-400      = #fbbf24 (For badge)
```

## 2. Typography Scale

```
Headers:
  text-2xl font-bold = Heading 1 (24px, bold)
  text-lg font-semibold = Heading 2 (18px, semibold)
  text-base font-semibold = Heading 3 (16px, semibold)

Body:
  text-sm font-semibold = Label (14px, semibold)
  text-sm text-slate-500 = Subtitle (14px, gray)
  text-xs = Small text (12px)
  text-[10px] = Micro text (10px, for badge)
```

## 3. Spacing System

```
Padding:
  px-3 = 12px horizontal
  px-4 = 16px horizontal
  px-5 = 20px horizontal
  py-2 = 8px vertical
  py-3 = 12px vertical
  px-6 = 24px horizontal
  pt-14 = 56px top

Gaps:
  gap-2 = 8px
  gap-3 = 12px
  mr-2 = 8px right margin
  mr-3 = 12px right margin
  mt-1 = 4px top margin
  mt-2 = 8px top margin
  mt-3 = 12px top margin
  mt-4 = 16px top margin
  mt-6 = 24px top margin

Margins:
  mb-2 = 8px bottom
  mb-3 = 12px bottom
  mb-4 = 16px bottom
  mb-6 = 24px bottom
```

## 4. Corner Radius

```
rounded-2xl = 16px (Medium, for buttons & inputs)
rounded-3xl = 24px (Large, for header & cards)
rounded-full = 9999px (Pills & badges)
```

## 5. Shadow System

```
shadow-sm = Subtle shadow (cards at rest)
shadow-lg = Strong shadow (floating elements)
shadow-xl = Extra strong shadow (prominent cards)
```

## 6. Complete Screen Layout

```
┌──────────────────────────────────────────────────────┐
│                   SAFE AREA VIEW                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │      DARK HEADER (bg-slate-900)                │ │
│  │                                                 │ │
│  │  ┌──────────────────────────┐        [🔔]     │ │
│  │  │ PIATAUTO (small caption) │               │ │
│  │  │ Găsește-ți mașina        │               │ │
│  │  │ (text-2xl, white, bold)  │               │ │
│  │  └──────────────────────────┘               │ │
│  │                                              │ │
│  │  ┌──────────────────────────────────────────┐│ │
│  │  │ Setează filtrele și descoperă mașina... ││ │
│  │  │ (text-sm, white/80)                      ││ │
│  │  └──────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────┘ │
│            ↓ mt-4 spacing                          │
│  ┌────────────────────────────────────────────────┐ │
│  │     FILTER CARD (white, rounded-b-3xl)         │ │
│  │                                                 │ │
│  │  ┌─ Tip caroserie ──────────────────────────┐ │ │
│  │  │ ▼ Selectează...                          │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ mb-4                             │ │
│  │  ┌─ Marcă ───────────────────────────────────┐ │ │
│  │  │ ▼ BMW                                     │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ Conditionally shown if brand    │ │
│  │  ┌─ Model ───────────────────────────────────┐ │ │
│  │  │ ▼ X5                                      │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ Conditionally shown if model    │ │
│  │  ┌─ Generație ────────────────────────────────┐ │ │
│  │  │ ▼ G05 (2023+)                            │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ mb-4                             │ │
│  │  ┌─ An ──────────────────────────────────────┐ │ │
│  │  │ ◄──► Expandable                           │ │ │
│  │  │ De la... - Până la...                     │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ When expanded: mb-4              │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ bg-slate-50 p-4 rounded-2xl              │ │ │
│  │  │  [De la] [Până la]                       │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │           ↓ mb-4                             │ │
│  │  ┌─ Preț ────────────────────────────────────┐ │ │
│  │  │ ◄──► Expandable                           │ │ │
│  │  │ 5.000 € - 50.000 €                       │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ When expanded: mb-4              │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ bg-slate-50 p-4 rounded-2xl              │ │ │
│  │  │  [De la €] [Până la €]                   │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │           ↓ mb-4                             │ │
│  │  ┌─ Kilometraj ──────────────────────────────┐ │ │
│  │  │ ◄──► Expandable                           │ │ │
│  │  │ 10.000 km - 200.000 km                   │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │           ↓ When expanded: mb-6              │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │ bg-slate-50 p-4 rounded-2xl              │ │ │
│  │  │  [De la km] [Până la km]                 │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                              │ │
│  │  ┌──────────┐ ┌───────────────────────────┐ │ │
│  │  │ Resetează│ │ Caută                     │ │ │
│  │  │(ghost)   │ │(primary, full-width)      │ │ │
│  │  └──────────┘ └───────────────────────────┘ │ │
│  │  flex-row gap-3                             │ │
│  └────────────────────────────────────────────────┘ │
│            ↓ mt-6                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │       POPULAR BRANDS (Horizontal Scroll)       │ │
│  │                                                 │ │
│  │ [BMW] [Audi] [Mercedes] [VW] [Skoda] [Toyota] │ │
│  │ (flex-row, gap-2, px-4)                        │ │
│  └────────────────────────────────────────────────┘ │
│            ↓ mt-6                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │     FEATURED LISTINGS (Horizontal Scroll)      │ │
│  │                                                 │
│  │ [Card 1] [Card 2] [Card 3] ...                 │ │
│  │ w-[300px], gap-3                              │ │
│  └────────────────────────────────────────────────┘ │
│            ↓ mt-6                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │         RECENT LISTINGS (Vertical List)        │ │
│  │                                                 │ │
│  │  [Listing 1]                                    │ │
│  │  [Listing 2]                                    │ │
│  │  [Listing 3]                                    │ │
│  │  ... (infinite scroll)                         │ │
│  │                                                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 7. Component Styling Details

### Header Section

```
View:
  rounded-b-[36px]
  bg-slate-900
  px-5
  pb-6
  pt-8

Title:
  text-2xl font-bold text-white | "Găsește-ți mașina"

Caption:
  text-xs uppercase tracking-[0.25em] text-slate-400 | "PiataAuto"

Subtitle Container:
  rounded-2xl
  bg-white/10
  px-4
  py-3
  (backdrop blur effect)

Subtitle Text:
  text-sm text-white/80
  "Setează filtrele și descoperă mașina..."
```

### Filter Input

```
Dropdown Button:
  flex-row items-center justify-between
  rounded-2xl
  border border-slate-200
  bg-white
  px-3
  py-3
  shadow-sm

Label (above):
  text-sm font-semibold text-slate-700

Selected Value:
  text-slate-900 (if selected)
  text-slate-500 (if placeholder)

Chevron Icon:
  size={12}
  color="#64748b"
```

### Range Input (Expanded)

```
Container:
  rounded-2xl
  bg-slate-50
  p-4

Inputs (flex-row gap-3):
  flex-1 each
  rounded-2xl
  border border-slate-200
  bg-white
  px-3
  py-3
  shadow-sm

Placeholder:
  color="#cbd5e1" (lighter gray)
```

### Action Buttons

```
Container:
  flex-row
  gap-3
  mb-6

Reset Button (flex-1):
  [AppButton] variant="ghost"

Search Button (flex-1):
  [AppButton] variant="primary"
```

### Modal Dropdown

```
Overlay:
  flex-1 justify-end
  bg-black/40 (40% opacity black)

Modal Content:
  rounded-t-3xl
  bg-white

Title Area:
  border-b border-slate-200
  px-4
  py-4

Options List:
  maxHeight: 300

Option Item:
  border-b border-slate-100
  px-4
  py-4

Selected Option:
  bg-primary/5 (5% primary fill)

Check Icon:
  size={14}
  color="#2563eb"
```

## 8. Interactive States

### Button States

```
Normal:     bg-primary/opacity-100
Pressed:    scale-95 (press animation)
Disabled:   bg-slate-300, text-slate-500

Ghost (Reset):
  Normal:   bg-slate-100
  Pressed:  bg-slate-200
```

### Dropdown States

```
Closed:
  chevron-down (rotate 0°)

Expanded:
  chevron-up (rotate 180°)
  bg-slate-50 container shown below
```

### Selected States

```
Option:
  Selected:   bg-primary/5, text-primary, font-semibold, ✓ checkmark
  Unselected: bg-transparent, text-slate-900
```

## 9. Spacing Rules

### Between Major Sections

```
Header → Filter Card:       mt-4
Filter Card → Popular:      mt-6
Popular → Featured:         mt-6
Featured → Recent Header:   mt-6
Recent Header → First Item: Use FlatList contentContainerStyle
```

### Within Filters

```
Each dropdown/range:  mb-4
Range expanded area:  mb-4 (except last, mb-6)
Buttons area:         mb-6 (bottom of filter card)
```

### Within Items

```
Horizontal scroll items: mr-3 (content gap-3)
Vertical list items:    pb-4 (in FlatList renderItem View)
```

## 10. Responsive Considerations

### Small Screens (< 375px)

```
- Maintain same layout
- Padding reduces slightly: px-3 instead of px-4
- Font sizes stay consistent via NativeWind scaling
- RangeInput inputs might stack on very small screens
```

### Large Screens (> 500px)

```
- Layout remains same (mobile priority)
- Max-width constraints could be added to filter card
- Same padding model applies
```

## 11. Dark Mode Support (Future)

```
Dark Theme Palette:
  bg-slate-900 → bg-neutral-900
  bg-white → bg-neutral-800
  text-slate-900 → text-neutral-100
  text-slate-500 → text-neutral-400
  border-slate-200 → border-neutral-700
```

---

## 12. Animation & Micro-interactions

### Range Expand/Collapse

```
- Chevron rotates (implicit)
- Content fades in/slides up (iOS transition)
- Smooth 300ms animation
```

### Dropdown Selection

```
- Modal slides up from bottom (animationType="fade" + position)
- Options select with highlight animation
- Checkmark appears
```

### Button Press

```
- Primary: scale-95 compression
- Ghost: opacity change
- 100ms spring animation
```

---

This design delivers a modern, intuitive filter experience matching production-quality marketplace apps.
