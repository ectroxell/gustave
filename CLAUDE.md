# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gustave is a POC warehouse receiving app for tracking purchase orders and receiving items. It's themed after The Legend of Zelda — items are Zelda game items, characters place orders, and currency is rupees.

Node.js project using ES modules (`"type": "module"`). Node and npm versions are pinned via Volta (Node 24.8.0, npm 11.6.0).

## Tech Stack

- **Database**: SQLite via `better-sqlite3`
- **ORM**: Drizzle ORM + Drizzle Kit
- **Runtime**: `tsx` for running TypeScript directly
- **TypeScript**: ESM with `"module": "NodeNext"`

## Project Structure

```
gustave/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── .gitignore
├── CLAUDE.md
├── src/
│   └── db/
│       ├── schema.ts        # Table definitions
│       ├── index.ts         # DB connection (exports `db`)
│       └── seed.ts          # Seed script with all data
├── data/
│   ├── .gitkeep
│   └── gustave.db           # (gitignored) SQLite file
└── drizzle/                 # (auto-generated) migrations
```

## Commands

- `npm run db:push` — push schema to SQLite database
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:seed` — seed the database with Zelda-themed data
- `npm run db:studio` — open Drizzle Studio to inspect data
- `npm run db:reset` — delete DB, re-push schema, and re-seed
- `npm run typecheck` — run TypeScript type checking

## Database Schema

Five tables: `characters`, `items`, `warehouse_locations`, `purchase_orders`, `purchase_order_items`. Schema defined in `src/db/schema.ts`. Foreign keys are enforced via SQLite pragma. WAL journal mode is enabled.
