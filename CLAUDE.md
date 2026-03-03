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
- **Linting & Formatting**: ESLint with Stylistic plugin (flat config)

## Project Structure

```
gustave/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── eslint.config.js         # ESLint flat config with Stylistic
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

**Database:**

- `npm run db:push` — push schema to SQLite database
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:seed` — seed the database with Zelda-themed data
- `npm run db:studio` — open Drizzle Studio to inspect data
- `npm run db:reset` — delete DB, re-push schema, and re-seed

**Code quality:**

- `npm run typecheck` — run TypeScript type checking
- `npm run lint` — run ESLint checks (includes formatting via Stylistic)
- `npm run lint:fix` — run ESLint checks and auto-fix issues (auto-formats code)

## Guidelines

- **Only run `db:*` commands when the change is database-related** (schema, seed data, migrations). Do not run database commands to verify unrelated changes like linting, formatting, or dependency updates. Use `npm run lint` and `npm run typecheck` to verify code quality changes.

## Database Schema

Five tables: `characters`, `items`, `warehouse_locations`, `purchase_orders`, `purchase_order_items`. Schema defined in `src/db/schema.ts`. Foreign keys are enforced via SQLite pragma. WAL journal mode is enabled.

## TypeScript Patterns

### Use `type` not `interface`

All new types should use `type` keyword:

```ts
// ✓ Preferred
type Character = { id: number; name: string };

// ✗ Avoid
interface Character {
  id: number;
  name: string;
}
```

### Drizzle Type Extraction

For database row types, use Drizzle's inference helpers rather than writing types manually:

```ts
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { characters } from './schema.js';

// Row type (for SELECT results)
type Character = InferSelectModel<typeof characters>;

// Insert type (for INSERT/UPDATE input)
type NewCharacter = InferInsertModel<typeof characters>;
```

Define these at the top of `schema.ts` and re-export them so callers don't need to derive them.

### Avoid `any`, prefer `unknown`

When a type is genuinely unknown, use `unknown` with narrowing rather than `any`:

```ts
// ✓ Preferred
function process(data: unknown) {
  if (typeof data === 'string') {
    // data is string here
  }
}

// ✗ Avoid
function process(data: any) {
  /* no type safety */
}
```
