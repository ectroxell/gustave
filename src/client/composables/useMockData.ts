import type {
  Character,
  DashboardCounts,
  Item,
  PurchaseOrderSummary,
  PurchaseOrderWithDetails,
  WarehouseLocation,
} from '../types/index.js';

const characters: Character[] = [
  { id: 1, name: 'Link', title: 'Hero of Hyrule', race: 'Hylian' },
  { id: 2, name: 'Zelda', title: 'Princess of Hyrule', race: 'Hylian' },
  { id: 3, name: 'Ganondorf', title: 'King of the Gerudo', race: 'Gerudo' },
  { id: 4, name: 'Impa', title: 'Sage of Shadow', race: 'Sheikah' },
  { id: 5, name: 'Beedle', title: 'Traveling Merchant', race: 'Hylian' },
  { id: 6, name: 'Purah', title: 'Director of Hateno Lab', race: 'Sheikah' },
  { id: 7, name: 'Sidon', title: 'Prince of the Zora', race: 'Zora' },
];

const items: Item[] = [
  { id: 1, name: 'Master Sword', description: 'The blade of evil\'s bane', category: 'weapon', rupeePrice: 1_000_000, isUnique: true },
  { id: 2, name: 'Hylian Shield', description: 'A shield said to have been used by a hero of legend', category: 'shield', rupeePrice: 3_000, isUnique: true },
  { id: 3, name: 'Bow of Light', description: 'A bow blessed with the power of the goddess', category: 'weapon', rupeePrice: 1_000_000, isUnique: true },
  { id: 4, name: 'Ocarina of Time', description: 'A mystical instrument that can manipulate time', category: 'key_item', rupeePrice: 1_000_000, isUnique: true },
  { id: 5, name: 'Fierce Deity Mask', description: 'A mask containing the merits of all masks', category: 'key_item', rupeePrice: 1_000_000, isUnique: true },
  { id: 6, name: 'Mirror Shield', description: 'A shield that reflects light and magic', category: 'shield', rupeePrice: 2_500, isUnique: true },
  { id: 7, name: 'Biggoron Sword', description: 'A massive sword forged by Biggoron', category: 'weapon', rupeePrice: 1_000, isUnique: true },
  { id: 8, name: 'Arrow', description: 'A standard arrow for bows', category: 'ammunition', rupeePrice: 5, isUnique: false },
  { id: 9, name: 'Fire Arrow', description: 'An arrow imbued with the power of fire', category: 'ammunition', rupeePrice: 20, isUnique: false },
  { id: 10, name: 'Ice Arrow', description: 'An arrow imbued with the power of ice', category: 'ammunition', rupeePrice: 20, isUnique: false },
  { id: 11, name: 'Shock Arrow', description: 'An arrow imbued with the power of lightning', category: 'ammunition', rupeePrice: 20, isUnique: false },
  { id: 12, name: 'Bomb', description: 'An explosive device useful for breaking walls', category: 'consumable', rupeePrice: 30, isUnique: false },
  { id: 13, name: 'Bombchu', description: 'A mouse-shaped bomb that runs along surfaces', category: 'consumable', rupeePrice: 40, isUnique: false },
  { id: 14, name: 'Red Potion', description: 'A potion that restores health', category: 'consumable', rupeePrice: 30, isUnique: false },
  { id: 15, name: 'Blue Potion', description: 'A potion that restores health and magic', category: 'consumable', rupeePrice: 100, isUnique: false },
  { id: 16, name: 'Fairy in a Bottle', description: 'A fairy captured in a bottle for emergency healing', category: 'consumable', rupeePrice: 80, isUnique: false },
  { id: 17, name: 'Deku Nut', description: 'A nut that stuns enemies with a flash of light', category: 'consumable', rupeePrice: 10, isUnique: false },
  { id: 18, name: 'Deku Stick', description: 'A wooden stick from a Deku tree', category: 'material', rupeePrice: 5, isUnique: false },
  { id: 19, name: 'Hylian Rice', description: 'A grain widely cultivated in Hyrule', category: 'material', rupeePrice: 12, isUnique: false },
  { id: 20, name: 'Mighty Bananas', description: 'Bananas that boost attack power when cooked', category: 'material', rupeePrice: 15, isUnique: false },
  { id: 21, name: 'Hearty Durian', description: 'A fruit that restores many hearts when cooked', category: 'material', rupeePrice: 60, isUnique: false },
  { id: 22, name: 'Ancient Screw', description: 'A screw from ancient Sheikah technology', category: 'material', rupeePrice: 30, isUnique: false },
  { id: 23, name: 'Soldier\'s Broadsword', description: 'A sword favored by Hyrulean soldiers', category: 'weapon', rupeePrice: 300, isUnique: false },
  { id: 24, name: 'Traveler\'s Shield', description: 'A sturdy shield for road-weary travelers', category: 'shield', rupeePrice: 150, isUnique: false },
  { id: 25, name: 'Rubber Armor', description: 'Armor made from ancient rubber, resistant to electricity', category: 'armor', rupeePrice: 800, isUnique: false },
];

const locations: WarehouseLocation[] = [
  { id: 1, name: 'Kakariko Village', zone: 'village', capacity: 50 },
  { id: 2, name: 'Hateno Village', zone: 'village', capacity: 50 },
  { id: 3, name: 'Lurelin Village', zone: 'village', capacity: 30 },
  { id: 4, name: 'Tarrey Town', zone: 'village', capacity: 40 },
  { id: 5, name: 'Gerudo Town', zone: 'village', capacity: 50 },
  { id: 6, name: 'Rito Village', zone: 'village', capacity: 30 },
  { id: 7, name: 'Goron City', zone: 'village', capacity: 40 },
  { id: 8, name: 'Zora\'s Domain', zone: 'village', capacity: 40 },
  { id: 9, name: 'Korok Forest', zone: 'village', capacity: 30 },
  { id: 10, name: 'Riverside Stable', zone: 'stable', capacity: 20 },
  { id: 11, name: 'Dueling Peaks Stable', zone: 'stable', capacity: 20 },
  { id: 12, name: 'Woodland Stable', zone: 'stable', capacity: 20 },
  { id: 13, name: 'Foothill Stable', zone: 'stable', capacity: 20 },
  { id: 14, name: 'Gerudo Canyon Stable', zone: 'stable', capacity: 20 },
  { id: 15, name: 'Outskirt Stable', zone: 'stable', capacity: 20 },
  { id: 16, name: 'Hyrule Castle', zone: 'landmark', capacity: 100 },
  { id: 17, name: 'Great Plateau', zone: 'landmark', capacity: 60 },
  { id: 18, name: 'Death Mountain', zone: 'landmark', capacity: 30 },
  { id: 19, name: 'Lake Hylia', zone: 'landmark', capacity: 40 },
  { id: 20, name: 'Hebra Mountains', zone: 'landmark', capacity: 30 },
];

function findItem(id: number): Item {
  return items.find((i) => i.id === id)!;
}

function findLocation(id: number | null): WarehouseLocation | null {
  if (id === null) return null;
  return locations.find((l) => l.id === id) ?? null;
}

function findCharacter(id: number): Character {
  return characters.find((c) => c.id === id)!;
}

const purchaseOrders: PurchaseOrderWithDetails[] = [
  {
    id: 1, poNumber: 'PO-HYR-001', status: 'received', characterId: 5, notes: null, createdAt: '2025-12-01T10:00:00Z',
    character: findCharacter(5),
    items: [
      { id: 1, purchaseOrderId: 1, itemId: 8, quantityOrdered: 50, quantityReceived: 50, warehouseLocationId: 1, item: findItem(8), warehouseLocation: findLocation(1) },
      { id: 2, purchaseOrderId: 1, itemId: 12, quantityOrdered: 20, quantityReceived: 20, warehouseLocationId: 2, item: findItem(12), warehouseLocation: findLocation(2) },
      { id: 3, purchaseOrderId: 1, itemId: 14, quantityOrdered: 10, quantityReceived: 10, warehouseLocationId: 10, item: findItem(14), warehouseLocation: findLocation(10) },
      { id: 4, purchaseOrderId: 1, itemId: 17, quantityOrdered: 5, quantityReceived: 5, warehouseLocationId: 11, item: findItem(17), warehouseLocation: findLocation(11) },
    ],
    receipts: [
      {
        id: 1, receiptNumber: 'REC-HYR-001', purchaseOrderId: 1, notes: 'Full shipment received from Beedle', createdAt: '2025-12-02T14:00:00Z',
        lines: [
          { id: 1, receiptId: 1, purchaseOrderItemId: 1, quantityReceived: 50, isReceived: true, item: findItem(8) },
          { id: 2, receiptId: 1, purchaseOrderItemId: 2, quantityReceived: 20, isReceived: true, item: findItem(12) },
          { id: 3, receiptId: 1, purchaseOrderItemId: 3, quantityReceived: 10, isReceived: true, item: findItem(14) },
          { id: 4, receiptId: 1, purchaseOrderItemId: 4, quantityReceived: 5, isReceived: true, item: findItem(17) },
        ],
      },
    ],
  },
  {
    id: 2, poNumber: 'PO-HYR-002', status: 'partial', characterId: 1, notes: null, createdAt: '2025-12-03T09:00:00Z',
    character: findCharacter(1),
    items: [
      { id: 5, purchaseOrderId: 2, itemId: 1, quantityOrdered: 1, quantityReceived: 1, warehouseLocationId: 16, item: findItem(1), warehouseLocation: findLocation(16) },
      { id: 6, purchaseOrderId: 2, itemId: 2, quantityOrdered: 1, quantityReceived: 1, warehouseLocationId: 16, item: findItem(2), warehouseLocation: findLocation(16) },
      { id: 7, purchaseOrderId: 2, itemId: 8, quantityOrdered: 30, quantityReceived: 20, warehouseLocationId: 17, item: findItem(8), warehouseLocation: findLocation(17) },
      { id: 8, purchaseOrderId: 2, itemId: 9, quantityOrdered: 10, quantityReceived: 0, warehouseLocationId: null, item: findItem(9), warehouseLocation: null },
      { id: 9, purchaseOrderId: 2, itemId: 12, quantityOrdered: 5, quantityReceived: 0, warehouseLocationId: null, item: findItem(12), warehouseLocation: null },
    ],
    receipts: [
      {
        id: 2, receiptNumber: 'REC-HYR-002', purchaseOrderId: 2, notes: 'Partial shipment — arrows short, fire arrows and bombs pending', createdAt: '2025-12-04T11:00:00Z',
        lines: [
          { id: 5, receiptId: 2, purchaseOrderItemId: 5, quantityReceived: 1, isReceived: true, item: findItem(1) },
          { id: 6, receiptId: 2, purchaseOrderItemId: 6, quantityReceived: 1, isReceived: true, item: findItem(2) },
          { id: 7, receiptId: 2, purchaseOrderItemId: 7, quantityReceived: 20, isReceived: false, item: findItem(8) },
        ],
      },
    ],
  },
  {
    id: 3, poNumber: 'PO-HYR-003', status: 'partial', characterId: 2, notes: null, createdAt: '2025-12-05T08:00:00Z',
    character: findCharacter(2),
    items: [
      { id: 10, purchaseOrderId: 3, itemId: 4, quantityOrdered: 1, quantityReceived: 0, warehouseLocationId: null, item: findItem(4), warehouseLocation: null },
      { id: 11, purchaseOrderId: 3, itemId: 15, quantityOrdered: 5, quantityReceived: 3, warehouseLocationId: 5, item: findItem(15), warehouseLocation: findLocation(5) },
      { id: 12, purchaseOrderId: 3, itemId: 19, quantityOrdered: 10, quantityReceived: 10, warehouseLocationId: 3, item: findItem(19), warehouseLocation: findLocation(3) },
      { id: 13, purchaseOrderId: 3, itemId: 21, quantityOrdered: 10, quantityReceived: 4, warehouseLocationId: 4, item: findItem(21), warehouseLocation: findLocation(4) },
    ],
    receipts: [
      {
        id: 3, receiptNumber: 'REC-HYR-003', purchaseOrderId: 3, notes: 'Partial shipment — ocarina still missing', createdAt: '2025-12-06T15:00:00Z',
        lines: [
          { id: 8, receiptId: 3, purchaseOrderItemId: 12, quantityReceived: 10, isReceived: true, item: findItem(19) },
          { id: 9, receiptId: 3, purchaseOrderItemId: 11, quantityReceived: 3, isReceived: false, item: findItem(15) },
          { id: 10, receiptId: 3, purchaseOrderItemId: 13, quantityReceived: 4, isReceived: false, item: findItem(21) },
        ],
      },
    ],
  },
  {
    id: 4, poNumber: 'PO-HYR-004', status: 'pending', characterId: 4, notes: null, createdAt: '2025-12-07T10:00:00Z',
    character: findCharacter(4),
    items: [
      { id: 14, purchaseOrderId: 4, itemId: 5, quantityOrdered: 1, quantityReceived: 0, warehouseLocationId: null, item: findItem(5), warehouseLocation: null },
      { id: 15, purchaseOrderId: 4, itemId: 11, quantityOrdered: 20, quantityReceived: 0, warehouseLocationId: null, item: findItem(11), warehouseLocation: null },
      { id: 16, purchaseOrderId: 4, itemId: 22, quantityOrdered: 15, quantityReceived: 0, warehouseLocationId: null, item: findItem(22), warehouseLocation: null },
      { id: 17, purchaseOrderId: 4, itemId: 16, quantityOrdered: 3, quantityReceived: 0, warehouseLocationId: null, item: findItem(16), warehouseLocation: null },
    ],
    receipts: [],
  },
  {
    id: 5, poNumber: 'PO-HYR-005', status: 'pending', characterId: 3, notes: null, createdAt: '2025-12-08T09:00:00Z',
    character: findCharacter(3),
    items: [
      { id: 18, purchaseOrderId: 5, itemId: 7, quantityOrdered: 1, quantityReceived: 0, warehouseLocationId: null, item: findItem(7), warehouseLocation: null },
      { id: 19, purchaseOrderId: 5, itemId: 6, quantityOrdered: 1, quantityReceived: 0, warehouseLocationId: null, item: findItem(6), warehouseLocation: null },
      { id: 20, purchaseOrderId: 5, itemId: 13, quantityOrdered: 10, quantityReceived: 0, warehouseLocationId: null, item: findItem(13), warehouseLocation: null },
      { id: 21, purchaseOrderId: 5, itemId: 20, quantityOrdered: 5, quantityReceived: 0, warehouseLocationId: null, item: findItem(20), warehouseLocation: null },
    ],
    receipts: [],
  },
  {
    id: 6, poNumber: 'PO-HYR-006', status: 'received', characterId: 7, notes: null, createdAt: '2025-12-09T11:00:00Z',
    character: findCharacter(7),
    items: [
      { id: 22, purchaseOrderId: 6, itemId: 10, quantityOrdered: 20, quantityReceived: 20, warehouseLocationId: 8, item: findItem(10), warehouseLocation: findLocation(8) },
      { id: 23, purchaseOrderId: 6, itemId: 15, quantityOrdered: 3, quantityReceived: 3, warehouseLocationId: 6, item: findItem(15), warehouseLocation: findLocation(6) },
      { id: 24, purchaseOrderId: 6, itemId: 14, quantityOrdered: 5, quantityReceived: 5, warehouseLocationId: 12, item: findItem(14), warehouseLocation: findLocation(12) },
    ],
    receipts: [
      {
        id: 4, receiptNumber: 'REC-HYR-004', purchaseOrderId: 6, notes: 'Full shipment received from Sidon', createdAt: '2025-12-10T10:00:00Z',
        lines: [
          { id: 11, receiptId: 4, purchaseOrderItemId: 22, quantityReceived: 20, isReceived: true, item: findItem(10) },
          { id: 12, receiptId: 4, purchaseOrderItemId: 23, quantityReceived: 3, isReceived: true, item: findItem(15) },
          { id: 13, receiptId: 4, purchaseOrderItemId: 24, quantityReceived: 5, isReceived: true, item: findItem(14) },
        ],
      },
    ],
  },
  {
    id: 7, poNumber: 'PO-HYR-007', status: 'partial', characterId: 6, notes: null, createdAt: '2025-12-10T08:00:00Z',
    character: findCharacter(6),
    items: [
      { id: 25, purchaseOrderId: 7, itemId: 22, quantityOrdered: 25, quantityReceived: 15, warehouseLocationId: 7, item: findItem(22), warehouseLocation: findLocation(7) },
      { id: 26, purchaseOrderId: 7, itemId: 11, quantityOrdered: 5, quantityReceived: 5, warehouseLocationId: 13, item: findItem(11), warehouseLocation: findLocation(13) },
      { id: 27, purchaseOrderId: 7, itemId: 25, quantityOrdered: 3, quantityReceived: 1, warehouseLocationId: 14, item: findItem(25), warehouseLocation: findLocation(14) },
      { id: 28, purchaseOrderId: 7, itemId: 23, quantityOrdered: 2, quantityReceived: 0, warehouseLocationId: null, item: findItem(23), warehouseLocation: null },
      { id: 29, purchaseOrderId: 7, itemId: 24, quantityOrdered: 4, quantityReceived: 0, warehouseLocationId: null, item: findItem(24), warehouseLocation: null },
    ],
    receipts: [
      {
        id: 5, receiptNumber: 'REC-HYR-005', purchaseOrderId: 7, notes: 'Partial shipment — broadswords and shields pending', createdAt: '2025-12-11T09:00:00Z',
        lines: [
          { id: 14, receiptId: 5, purchaseOrderItemId: 25, quantityReceived: 15, isReceived: false, item: findItem(22) },
          { id: 15, receiptId: 5, purchaseOrderItemId: 26, quantityReceived: 5, isReceived: true, item: findItem(11) },
          { id: 16, receiptId: 5, purchaseOrderItemId: 27, quantityReceived: 1, isReceived: false, item: findItem(25) },
        ],
      },
    ],
  },
];

export function useMockData() {
  function getAllPurchaseOrders(): PurchaseOrderWithDetails[] {
    return purchaseOrders;
  }

  function getPurchaseOrderByNumber(poNumber: string): PurchaseOrderWithDetails | undefined {
    return purchaseOrders.find((po) => po.poNumber === poNumber);
  }

  function getPurchaseOrderSummaries(): PurchaseOrderSummary[] {
    return purchaseOrders.map((po) => ({
      id: po.id,
      poNumber: po.poNumber,
      status: po.status,
      characterName: po.character.name,
      totalItems: po.items.length,
      totalOrdered: po.items.reduce((sum, i) => sum + i.quantityOrdered, 0),
      totalReceived: po.items.reduce((sum, i) => sum + i.quantityReceived, 0),
    }));
  }

  function getDashboardCounts(): DashboardCounts {
    return {
      pending: purchaseOrders.filter((po) => po.status === 'pending').length,
      partial: purchaseOrders.filter((po) => po.status === 'partial').length,
      received: purchaseOrders.filter((po) => po.status === 'received').length,
    };
  }

  function getWarehouseLocations(): WarehouseLocation[] {
    return locations;
  }

  function getLocationsByZone(): Record<string, WarehouseLocation[]> {
    const grouped: Record<string, WarehouseLocation[]> = {};
    for (const loc of locations) {
      if (!grouped[loc.zone]) grouped[loc.zone] = [];
      grouped[loc.zone].push(loc);
    }
    return grouped;
  }

  return {
    getAllPurchaseOrders,
    getPurchaseOrderByNumber,
    getPurchaseOrderSummaries,
    getDashboardCounts,
    getWarehouseLocations,
    getLocationsByZone,
  };
}
