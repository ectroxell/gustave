# Gustave's Warehouse — Project Spec

> A living document. Updated as the project evolves.

## Purpose

Gustave's Warehouse is a proof-of-concept warehouse receiving application for tracking purchase orders and receiving items at a dock. It is themed after The Legend of Zelda — items are Zelda game items, characters place orders, and currency is rupees.

## Theme

Dark fantasy aesthetic inspired by Hyrule. Color palette centers on deep navy backgrounds, green accents (Zelda's iconic green), gold highlights, and parchment-toned text. Typography pairs Montserrat (display/headings) with JetBrains Mono (data/tables).

## User Personas

### Warehouse Dock Worker

- Primary user
- Stands at a receiving dock with a tablet or desktop screen
- References a physical packing slip while interacting with the app
- Needs to quickly look up POs, see what's expected, and record what arrived
- Values speed, scannability, and minimal clicks over visual polish

## Core Workflows

### 1. PO Lookup

1. Worker enters a PO number (or browses the PO list)
2. App shows matching PO with status, items, and receiving history
3. Worker decides whether to begin receiving against the PO

### 2. Item Receiving

1. Worker opens a PO detail page
2. Clicks "New Receipt" to enter receiving mode
3. For each line item, enters the quantity received and selects a warehouse location
4. Reviews the receipt summary, optionally adds notes
5. Confirms the receipt — quantities update, PO status adjusts automatically

### 3. Receipt History

- Each PO tracks all receipts created against it
- Workers can expand past receipts to see line-level detail
- Provides an audit trail of what was received, when, and where it was stored

## Data Model

### Tables

| Table | Purpose |
|---|---|
| `characters` | Zelda characters who place purchase orders |
| `items` | Inventory items (weapons, consumables, materials, etc.) |
| `warehouse_locations` | Storage locations organized by zone |
| `purchase_orders` | PO headers with status and notes |
| `purchase_order_items` | Line items linking items to POs with ordered/received quantities |
| `receipts` | Receipt headers tied to a PO |
| `receipt_lines` | Individual lines recording qty received per PO item |

### Key Relationships

- A **character** places many **purchase orders**
- A **purchase order** has many **purchase order items** (each referencing an **item**)
- A **purchase order** has many **receipts**
- A **receipt** has many **receipt lines** (each referencing a **purchase order item**)
- A **purchase order item** may reference a **warehouse location**

### PO Statuses

- **pending** — nothing received yet
- **partial** — some items received, more expected
- **received** — all items fully received

## UI Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero branding, quick PO search, optional dashboard stats |
| `/receiving` | PO Lookup | Searchable, filterable table of all purchase orders |
| `/receiving/:poNumber` | Receiving Detail | Full PO view with line items, receipt history, and inline receiving flow |

### Navigation

- Top nav bar with links to Home and Receiving
- PO search available on Home and Receiving pages
- PO numbers in the table link directly to the detail page

## Non-Functional Requirements

### Accessibility

- All interactive elements keyboard-navigable
- Color is never the sole indicator — icons/text supplement status colors
- Focus indicators visible on all controls
- Form inputs have associated labels
- ARIA attributes on dynamic content (modals, live regions)

### Responsiveness

- Designed primarily for desktop/tablet (warehouse dock stations)
- Tables remain usable at 768px+ widths
- Receiving flow sticky panel adapts to viewport

### Theme

- Dark theme only (reduces glare on warehouse screens)
- High contrast text on dark backgrounds
- Consistent use of design tokens (see below)

## Design Tokens

```txt
Background:   #1a1a2e (primary), #16213e (surface), #0f3460 (elevated)
Text:         #e0d9b0 (primary), #5dbb63 (headings)
Accents:      #5dbb63 (green), #d4a017 (gold), #c0392b (red), #2980b9 (blue)
Border:       #2a2a4a
Fonts:        Montserrat (display), JetBrains Mono (data)
```
