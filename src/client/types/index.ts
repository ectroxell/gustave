export type Character = {
  id: number;
  name: string;
  title: string;
  race: string;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  category: string;
  rupeePrice: number;
  isUnique: boolean;
};

export type WarehouseLocation = {
  id: number;
  name: string;
  zone: string;
  capacity: number;
};

export type PurchaseOrder = {
  id: number;
  poNumber: string;
  status: 'pending' | 'partial' | 'received';
  characterId: number;
  notes: string | null;
  createdAt: string;
};

export type PurchaseOrderItem = {
  id: number;
  purchaseOrderId: number;
  itemId: number;
  quantityOrdered: number;
  quantityReceived: number;
  warehouseLocationId: number | null;
};

export type Receipt = {
  id: number;
  receiptNumber: string;
  purchaseOrderId: number;
  notes: string | null;
  createdAt: string;
};

export type ReceiptLine = {
  id: number;
  receiptId: number;
  purchaseOrderItemId: number;
  quantityReceived: number;
  isReceived: boolean;
};

// Joined types for UI consumption

export type PurchaseOrderWithDetails = PurchaseOrder & {
  character: Character;
  items: PurchaseOrderLineItem[];
  receipts: ReceiptWithLines[];
};

export type PurchaseOrderLineItem = PurchaseOrderItem & {
  item: Item;
  warehouseLocation: WarehouseLocation | null;
};

export type ReceiptWithLines = Receipt & {
  lines: (ReceiptLine & {
    item: Item;
  })[];
};

export type PurchaseOrderSummary = {
  id: number;
  poNumber: string;
  status: 'pending' | 'partial' | 'received';
  characterName: string;
  totalItems: number;
  totalOrdered: number;
  totalReceived: number;
};

export type DashboardCounts = {
  pending: number;
  partial: number;
  received: number;
};
