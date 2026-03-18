# Design System Agent Memory

## Components

### AppButton (`src/client/components/ui/AppButton.vue`)
- Variants: `primary`, `secondary`, `danger`, `ghost`
- Sizes: `sm` (h-8), `md` (h-10), `lg` (h-14)
- Ghost variant: transparent bg, `text-text-primary/60` with hover to full opacity, no background
- Base classes include `cursor-pointer`

### AppInput (`src/client/components/ui/AppInput.vue`)
- Props: `label`, `modelValue`, `type`, `placeholder`, `error`
- Supports optional `#icon` slot for leading icon (adds `pl-10` when present, `px-4` when absent)
- Icon wrapper positioned with `absolute left-3 top-1/2 -translate-y-1/2`
- Uses `useSlots()` to detect icon slot presence

### AppFilterButton (`src/client/components/ui/AppFilterButton.vue`)
- Props: `active` (boolean, default false)
- Pill-shaped (`rounded-full`) toggle button
- Active: `bg-accent-green/15 text-accent-green border-accent-green/40`
- Inactive: `bg-transparent text-text-primary/50 border-white/10` with hover states
- Sets `aria-pressed` from `active` prop
- Font: `font-display text-xs font-semibold uppercase tracking-wider`

### AppBadge (`src/client/components/ui/AppBadge.vue`)
- Not yet reviewed in detail

### AppCard (`src/client/components/ui/AppCard.vue`)
- Not yet reviewed in detail

## Design Tokens (from `src/client/tailwind.css`)
- Backgrounds: `bg-primary`, `bg-surface`, `bg-elevated`
- Text: `text-primary`, `text-heading`
- Accents: `accent-green`, `accent-gold`, `accent-red`, `accent-blue`
- Border: `border` (#2a2a4a)
- Fonts: `font-display` (Montserrat), `font-data` (JetBrains Mono)

## Conventions
- All components use `<script setup lang="ts">` with `type` keyword (not interface)
- Tailwind-only styling, `<style scoped>` only when utilities are insufficient
- `App` prefix on all design system components
- Focus indicators: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary`
