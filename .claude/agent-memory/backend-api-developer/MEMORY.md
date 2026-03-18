# Backend API Developer Memory

## Project Structure
- Express app created in `src/server/app.ts`, exported as `{ app }`
- Server entry point: `src/server/index.ts` (imports app, adds Vite middleware, listens on port 3030)
- Routes organized in `src/server/routes/` (e.g., `purchaseOrders.ts`)
- DB connection: `src/db/index.ts` exports `db` (drizzle with schema)
- DB schema: `src/db/schema.ts`

## Route Patterns
- Routes use Express Router, exported as named exports (e.g., `purchaseOrderRoutes`)
- Registered in `app.ts` with `app.use('/api/purchase-orders', purchaseOrderRoutes)`
- `app.use(express.json())` is configured in `app.ts`
- Response shapes: `{ data: ... }` for success, `{ error: "message" }` for errors
- Response types defined explicitly (e.g., `type PurchaseOrderResponse`)

## Swagger/OpenAPI Setup
- Config: `src/server/swagger.ts` exports `swaggerSpec` (swagger-jsdoc with OpenAPI 3.0)
- UI served at `/api-docs` via swagger-ui-express in `app.ts`
- Route files scanned via glob: `./src/server/routes/*.ts`
- Annotations use `@openapi` JSDoc tag directly above route handlers
- Tags used: "Purchase Orders" (add more as routes are created)

## Drizzle Query Patterns
- `db.select().from(table).where(...).get()` for single row
- `db.select().from(table).where(...).all()` for multiple rows
- `.innerJoin()` with custom select shape for joining related tables
- Import `eq` from `drizzle-orm` for equality conditions

## Lint Rules (from ESLint Stylistic)
- `@stylistic/newline-per-chained-call`: chained calls like `res.status(404).json(...)` must break onto new lines
- `@stylistic/brace-style`: `} catch` must be on same line (1TBS style)
- Always run `npm run lint:fix` to auto-fix formatting issues

## Express Version
- Express 5 is in use (v5.2.1) - supports async route handlers natively
