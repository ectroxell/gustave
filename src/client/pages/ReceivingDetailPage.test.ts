import { render, screen, waitFor, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createRouter, createMemoryHistory } from 'vue-router';
import { server } from '../test/mocks/server.js';
import ReceivingDetailPage from './ReceivingDetailPage.vue';

// --- Test data ---

const pendingPO = {
  data: {
    id: 4,
    poNumber: 'PO-HYR-004',
    status: 'pending' as const,
    notes: null,
    createdAt: '2025-01-15T00:00:00.000Z',
    character: { id: 3, name: 'Ganondorf', title: 'King of the Gerudo', race: 'Gerudo' },
    items: [
      {
        id: 14,
        quantityOrdered: 1,
        quantityReceived: 0,
        warehouseLocationId: null,
        item: { id: 10, name: 'Fierce Deity Mask', description: 'A mask', category: 'mask', rupeePrice: 5000, isUnique: true },
      },
      {
        id: 15,
        quantityOrdered: 20,
        quantityReceived: 0,
        warehouseLocationId: null,
        item: { id: 11, name: 'Shock Arrow', description: 'An arrow', category: 'ammo', rupeePrice: 20, isUnique: false },
      },
    ],
  },
};

const receivedPO = {
  data: {
    ...pendingPO.data,
    poNumber: 'PO-HYR-001',
    status: 'received' as const,
    items: pendingPO.data.items.map((item) => ({
      ...item,
      quantityReceived: item.quantityOrdered,
    })),
  },
};

const partialPO = {
  data: {
    ...pendingPO.data,
    poNumber: 'PO-HYR-002',
    status: 'partial' as const,
    items: [
      { ...pendingPO.data.items[0], quantityReceived: 0 },
      { ...pendingPO.data.items[1], quantityReceived: 10 },
    ],
  },
};

const warehouseLocationsResponse = {
  data: [
    { id: 1, name: 'Kakariko Village', zone: 'village', capacity: 50 },
    { id: 2, name: 'Hyrule Castle', zone: 'landmark', capacity: 100 },
    { id: 3, name: 'Riverside Stable', zone: 'stable', capacity: 20 },
  ],
};

const receiptsResponse = {
  data: [
    {
      id: 1,
      receiptNumber: 'REC-HYR-001',
      notes: 'First delivery',
      createdAt: '2025-01-10T00:00:00.000Z',
      lines: [
        {
          id: 1,
          quantityReceived: 5,
          item: { id: 11, name: 'Shock Arrow', category: 'ammo' },
          warehouseLocation: 'Kakariko Village',
        },
      ],
    },
    {
      id: 2,
      receiptNumber: 'REC-HYR-002',
      notes: null,
      createdAt: '2025-01-05T00:00:00.000Z',
      lines: [
        {
          id: 2,
          quantityReceived: 1,
          item: { id: 10, name: 'Fierce Deity Mask', category: 'key_item' },
          warehouseLocation: null,
        },
      ],
    },
  ],
};

const emptyReceiptsResponse = { data: [] };

// --- Helpers ---

function setupHandlers(poResponse: { data: { status: string; [key: string]: unknown } }, poNumber: string) {
  server.use(
    http.get(`/api/purchase-orders/${poNumber}`, () =>
      HttpResponse.json(poResponse),
    ),
    http.get(`/api/purchase-orders/${poNumber}/receipts`, () =>
      HttpResponse.json(emptyReceiptsResponse),
    ),
    http.get('/api/warehouse-locations', () =>
      HttpResponse.json(warehouseLocationsResponse),
    ),
  );
}

async function renderPage(poNumber: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/receiving/:poNumber', component: ReceivingDetailPage },
      { path: '/receiving', component: { template: '<div>Receiving List</div>' } },
    ],
  });

  await router.push(`/receiving/${poNumber}`);
  await router.isReady();

  return render(ReceivingDetailPage, {
    global: {
      plugins: [router],
    },
  });
}

// --- Tests ---

describe('ReceivingDetailPage', () => {
  describe('New Receipt button visibility', () => {
    it('shows New Receipt button when PO status is pending', async () => {
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      expect(await screen.findByRole('button', { name: /new receipt/i }))
        .toBeVisible();
    });

    it('shows New Receipt button when PO status is partial', async () => {
      setupHandlers(partialPO, 'PO-HYR-002');
      await renderPage('PO-HYR-002');

      expect(await screen.findByRole('button', { name: /new receipt/i }))
        .toBeVisible();
    });

    it('does not show New Receipt button when PO status is received', async () => {
      setupHandlers(receivedPO, 'PO-HYR-001');
      await renderPage('PO-HYR-001');

      // Wait for the PO to load by checking for the PO number heading
      await screen.findByText('PO-HYR-001');

      expect(screen.queryByRole('button', { name: /new receipt/i }))
        .not.toBeInTheDocument();
    });
  });

  describe('entering receiving mode', () => {
    it('shows the receiving form when New Receipt is clicked', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));

      expect(await screen.findByText('Receive Items'))
        .toBeVisible();
    });

    it('shows quantity inputs with correct max constraints', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));

      const qtyInputs = await screen.findAllByLabelText('Qty');
      // Fierce Deity Mask: 1 ordered, 0 received => max 1
      expect(qtyInputs[0])
        .toHaveAttribute('max', '1');
      expect(qtyInputs[0])
        .toHaveAttribute('min', '0');
      // Shock Arrow: 20 ordered, 0 received => max 20
      expect(qtyInputs[1])
        .toHaveAttribute('max', '20');
    });

    it('populates warehouse location dropdowns', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));

      const locationSelects = await screen.findAllByLabelText('Location');
      const options = within(locationSelects[0])
        .getAllByRole('option');

      // "Select location" default + 3 warehouse locations
      expect(options)
        .toHaveLength(4);
      expect(options[1])
        .toHaveTextContent('Kakariko Village (village)');
      expect(options[2])
        .toHaveTextContent('Hyrule Castle (landmark)');
    });

    it('hides the New Receipt button while in receiving mode', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');

      expect(screen.queryByRole('button', { name: /new receipt/i }))
        .not.toBeInTheDocument();
    });
  });

  describe('review step', () => {
    async function enterReviewMode() {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');
      await user.click(screen.getByRole('button', { name: /review/i }));

      return user;
    }

    it('shows review summary with lines being received', async () => {
      await enterReviewMode();

      expect(await screen.findByText('Review Receipt'))
        .toBeVisible();
      // Both items default to qty 1, so both appear in the review summary
      // Each item name appears twice: once in the line items table, once in the review
      const maskElements = screen.getAllByText('Fierce Deity Mask');
      expect(maskElements)
        .toHaveLength(2);
      // Each review line shows quantity with + prefix
      const qtyElements = screen.getAllByText('+1');
      expect(qtyElements)
        .toHaveLength(2);
    });

    it('shows notes textarea in review step', async () => {
      await enterReviewMode();

      await screen.findByText('Review Receipt');
      expect(screen.getByLabelText(/notes/i))
        .toBeVisible();
    });

    it('navigates back to form when Back is clicked', async () => {
      const user = await enterReviewMode();

      await screen.findByText('Review Receipt');
      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(await screen.findByText('Receive Items'))
        .toBeVisible();
    });
  });

  describe('submitting a receipt', () => {
    it('submits POST to the correct endpoint with the right payload', async () => {
      const user = userEvent.setup();
      let capturedBody: unknown = null;
      let capturedUrl = '';

      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.post('/api/purchase-orders/:poNumber/receive', async ({ request, params }) => {
          capturedUrl = `/api/purchase-orders/${params.poNumber}/receive`;
          capturedBody = await request.json();
          // Return updated PO as received
          return HttpResponse.json({
            data: {
              id: 10,
              receiptNumber: 'REC-HYR-006',
              notes: null,
              createdAt: '2025-02-01T00:00:00.000Z',
              lines: [],
            },
          }, { status: 201 });
        }),
      );

      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');
      await user.click(screen.getByRole('button', { name: /review/i }));
      await screen.findByText('Review Receipt');

      // Add a note
      await user.type(screen.getByLabelText(/notes/i), 'Test delivery note');
      await user.click(screen.getByRole('button', { name: /confirm receipt/i }));

      await waitFor(() => {
        expect(capturedUrl)
          .toBe('/api/purchase-orders/PO-HYR-004/receive');
        expect(capturedBody)
          .toEqual({
            lines: [
              { purchaseOrderItemId: 14, quantity: 1 },
              { purchaseOrderItemId: 15, quantity: 1 },
            ],
            notes: 'Test delivery note',
          });
      });
    });

    it('shows error message on submission failure', async () => {
      const user = userEvent.setup();

      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.post('/api/purchase-orders/:poNumber/receive', () =>
          HttpResponse.json({ error: 'Something went wrong' }, { status: 500 }),
        ),
      );

      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');
      await user.click(screen.getByRole('button', { name: /review/i }));
      await screen.findByText('Review Receipt');
      await user.click(screen.getByRole('button', { name: /confirm receipt/i }));

      expect(await screen.findByRole('alert'))
        .toHaveTextContent('Something went wrong');
    });
  });

  describe('cancel receiving', () => {
    it('exits receiving mode when Cancel is clicked', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // New Receipt button should be back
      expect(await screen.findByRole('button', { name: /new receipt/i }))
        .toBeVisible();
      // Receiving form should be gone
      expect(screen.queryByText('Receive Items'))
        .not.toBeInTheDocument();
    });
  });

  describe('Receipt History', () => {
    it('renders receipt cards from mocked API response', async () => {
      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.get('/api/purchase-orders/PO-HYR-004/receipts', () =>
          HttpResponse.json(receiptsResponse),
        ),
      );
      await renderPage('PO-HYR-004');

      expect(await screen.findByText('REC-HYR-001'))
        .toBeVisible();
    });

    it('shows empty state when receipts array is empty', async () => {
      setupHandlers(pendingPO, 'PO-HYR-004');
      await renderPage('PO-HYR-004');

      expect(await screen.findByText('No receipts recorded yet.'))
        .toBeVisible();
    });

    it('most recent receipt is expanded by default', async () => {
      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.get('/api/purchase-orders/PO-HYR-004/receipts', () =>
          HttpResponse.json(receiptsResponse),
        ),
      );
      await renderPage('PO-HYR-004');

      await screen.findByText('REC-HYR-001');
      // The first receipt's expand button should have aria-expanded=true
      const firstReceiptButton = screen.getByRole('button', { name: /REC-HYR-001/i });
      expect(firstReceiptButton)
        .toHaveAttribute('aria-expanded', 'true');
      // The receipt's line content should be visible — use getAllByText
      // since "Shock Arrow" also appears in the line items table
      const shockArrows = screen.getAllByText('Shock Arrow');
      expect(shockArrows.length)
        .toBeGreaterThanOrEqual(2);
      // The one in the receipt history table should be visible
      expect(shockArrows[shockArrows.length - 1])
        .toBeVisible();
    });

    it('expand/collapse toggle works', async () => {
      const user = userEvent.setup();
      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.get('/api/purchase-orders/PO-HYR-004/receipts', () =>
          HttpResponse.json(receiptsResponse),
        ),
      );
      await renderPage('PO-HYR-004');

      await screen.findByText('REC-HYR-001');

      // Second receipt (REC-HYR-002) should be collapsed
      const secondReceiptButton = screen.getByRole('button', { name: /REC-HYR-002/i });
      expect(secondReceiptButton)
        .toHaveAttribute('aria-expanded', 'false');

      // Click the second receipt header to expand it
      await user.click(secondReceiptButton);
      expect(secondReceiptButton)
        .toHaveAttribute('aria-expanded', 'true');

      // Click again to collapse
      await user.click(secondReceiptButton);
      expect(secondReceiptButton)
        .toHaveAttribute('aria-expanded', 'false');
    });

    it('receipt history re-fetches after a new receipt is submitted', async () => {
      const user = userEvent.setup();
      let receiptsCallCount = 0;

      setupHandlers(pendingPO, 'PO-HYR-004');
      server.use(
        http.get('/api/purchase-orders/PO-HYR-004/receipts', () => {
          receiptsCallCount++;
          return HttpResponse.json(emptyReceiptsResponse);
        }),
        http.post('/api/purchase-orders/:poNumber/receive', () =>
          HttpResponse.json({
            data: {
              id: 10,
              receiptNumber: 'REC-HYR-006',
              notes: null,
              createdAt: '2025-02-01T00:00:00.000Z',
              lines: [],
            },
          }, { status: 201 }),
        ),
      );

      await renderPage('PO-HYR-004');

      // Wait for initial receipts fetch
      await screen.findByText('No receipts recorded yet.');
      const initialCount = receiptsCallCount;

      // Go through the submit flow
      await user.click(await screen.findByRole('button', { name: /new receipt/i }));
      await screen.findByText('Receive Items');
      await user.click(screen.getByRole('button', { name: /review/i }));
      await screen.findByText('Review Receipt');
      await user.click(screen.getByRole('button', { name: /confirm receipt/i }));

      // After submission, receipts should be re-fetched
      await waitFor(() => {
        expect(receiptsCallCount)
          .toBeGreaterThan(initialCount);
      });
    });
  });
});
