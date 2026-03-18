import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { characterRoutes } from './routes/characters.js';
import { purchaseOrderRoutes } from './routes/purchaseOrders.js';
import { warehouseLocationRoutes } from './routes/warehouseLocations.js';
import { receiptRoutes } from './routes/receipts.js';
import { swaggerSpec } from './swagger.js';

const app = express();

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.use('/api/characters', characterRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/purchase-orders', receiptRoutes);
app.use('/api/warehouse-locations', warehouseLocationRoutes);

export { app };
