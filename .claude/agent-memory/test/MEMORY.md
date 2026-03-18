# Test Writer Agent Memory

## Client Test Patterns

### Rendering pages with route params
Use a custom router with `createRouter`/`createMemoryHistory`, push to the route, then pass as a plugin:
```ts
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/receiving/:poNumber', component: ReceivingDetailPage }],
});
await router.push(`/receiving/${poNumber}`);
await router.isReady();
render(Component, { global: { plugins: [router] } });
```
The generic `renderWithRouter()` helper only has catch-all routes, so page components with specific route params need a custom router.

### MSW handler setup
- MSW server is initialized in `src/client/test/mocks/server.ts`, lifecycle managed in `setup.ts`
- Default handlers in `src/client/test/mocks/handlers.ts` (currently empty)
- Use `server.use()` in tests to add per-test handlers; `afterEach` resets them automatically
- Import from `msw`: `http`, `HttpResponse` (v2 API)

### Duplicate text in DOM
When testing page components, element text may appear in multiple sections (e.g., item names in a table AND a receipt history panel). Use `within()` scoped queries or `getAllByText()` with length assertions instead of `getByText()`.

### Lint rules to watch for
- `testing-library/no-node-access`: Don't use `.closest()`, `.parentElement`, etc. Scope queries with `within()` on elements found via Testing Library queries.
- `@stylistic/newline-per-chained-call`: Break chained method calls onto separate lines. Also applies to `new Date().getTime()` — use a temp variable.

### Type widening for test data
When test fixtures use spread with overridden `status` fields (literal union types), the `setupHandlers` function parameter type must accommodate all variants. Use `{ data: { status: string; [key: string]: unknown } }` or define an explicit union type.

### Receipt History testing
- `ReceivingDetailPage` fetches receipts on mount via `GET /api/purchase-orders/:poNumber/receipts`
- `setupHandlers()` includes a receipts mock (empty by default) so existing tests don't break
- For tests needing receipt data, override with `server.use()` after `setupHandlers()`
- Expand/collapse uses `v-if` not `v-show` — collapsed content is removed from DOM
- Receipt buttons have `aria-expanded` attribute — prefer testing that over checking DOM presence
- First receipt is expanded by default (`expandedReceiptId` set on fetch)

## Server Test Patterns

### Read-only endpoints (GET)
No `beforeEach`/`afterEach` cleanup needed for read-only tests. Just test response shape, status, and content.

### Mutating endpoints (POST/PUT/DELETE)
Must reset DB state in `beforeEach`/`afterEach` — see `receiving.test.ts` `resetPO()` pattern.

### Seed data receipt associations
- REC-HYR-001 -> PO-HYR-001 (4 lines: Arrow, Bomb, Red Potion, Deku Nut)
- REC-HYR-002 -> PO-HYR-002 (3 lines: Master Sword, Hylian Shield, Arrow)
- REC-HYR-003 -> PO-HYR-003 (3 lines: Hylian Rice, Blue Potion, Hearty Durian)
- REC-HYR-004 -> PO-HYR-006 (3 lines: Ice Arrow, Blue Potion, Red Potion)
- REC-HYR-005 -> PO-HYR-007 (3 lines: Ancient Screw, Shock Arrow, Rubber Armor)
- PO-HYR-004 and PO-HYR-005 have NO receipts

## Key File Paths
- Client test setup: `src/client/test/setup.ts`
- MSW server: `src/client/test/mocks/server.ts`
- MSW handlers: `src/client/test/mocks/handlers.ts`
- Render helper: `src/client/test/render.ts`
- Server test setup: `src/server/test/setup.ts`
- Vite/test config: `vite.config.ts`
