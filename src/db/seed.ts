import { db } from './index.js';
import {
  characters,
  items,
  warehouseLocations,
  purchaseOrders,
  purchaseOrderItems,
  receipts,
  receiptLines,
} from './schema.js';

// --- Characters ---
const characterData = [
  { name: 'Link', title: 'Hero of Hyrule', race: 'Hylian' },
  { name: 'Zelda', title: 'Princess of Hyrule', race: 'Hylian' },
  { name: 'Ganondorf', title: 'King of the Gerudo', race: 'Gerudo' },
  { name: 'Impa', title: 'Sage of Shadow', race: 'Sheikah' },
  { name: 'Beedle', title: 'Traveling Merchant', race: 'Hylian' },
  { name: 'Purah', title: 'Director of Hateno Lab', race: 'Sheikah' },
  { name: 'Sidon', title: 'Prince of the Zora', race: 'Zora' },
] as const;

// --- Items ---
const itemData = [
  // Unique items
  {
    name: 'Master Sword',
    description: 'The blade of evil\'s bane',
    category: 'weapon',
    rupeePrice: 1_000_000,
    isUnique: true,
  },
  {
    name: 'Hylian Shield',
    description: 'A shield said to have been used by a hero of legend',
    category: 'shield',
    rupeePrice: 3_000,
    isUnique: true,
  },
  {
    name: 'Bow of Light',
    description: 'A bow blessed with the power of the goddess',
    category: 'weapon',
    rupeePrice: 1_000_000,
    isUnique: true,
  },
  {
    name: 'Ocarina of Time',
    description: 'A mystical instrument that can manipulate time',
    category: 'key_item',
    rupeePrice: 1_000_000,
    isUnique: true,
  },
  {
    name: 'Fierce Deity Mask',
    description: 'A mask containing the merits of all masks',
    category: 'key_item',
    rupeePrice: 1_000_000,
    isUnique: true,
  },
  {
    name: 'Mirror Shield',
    description: 'A shield that reflects light and magic',
    category: 'shield',
    rupeePrice: 2_500,
    isUnique: true,
  },
  {
    name: 'Biggoron Sword',
    description: 'A massive sword forged by Biggoron',
    category: 'weapon',
    rupeePrice: 1_000,
    isUnique: true,
  },
  // Common items
  {
    name: 'Arrow',
    description: 'A standard arrow for bows',
    category: 'ammunition',
    rupeePrice: 5,
    isUnique: false,
  },
  {
    name: 'Fire Arrow',
    description: 'An arrow imbued with the power of fire',
    category: 'ammunition',
    rupeePrice: 20,
    isUnique: false,
  },
  {
    name: 'Ice Arrow',
    description: 'An arrow imbued with the power of ice',
    category: 'ammunition',
    rupeePrice: 20,
    isUnique: false,
  },
  {
    name: 'Shock Arrow',
    description: 'An arrow imbued with the power of lightning',
    category: 'ammunition',
    rupeePrice: 20,
    isUnique: false,
  },
  {
    name: 'Bomb',
    description: 'An explosive device useful for breaking walls',
    category: 'consumable',
    rupeePrice: 30,
    isUnique: false,
  },
  {
    name: 'Bombchu',
    description: 'A mouse-shaped bomb that runs along surfaces',
    category: 'consumable',
    rupeePrice: 40,
    isUnique: false,
  },
  {
    name: 'Red Potion',
    description: 'A potion that restores health',
    category: 'consumable',
    rupeePrice: 30,
    isUnique: false,
  },
  {
    name: 'Blue Potion',
    description: 'A potion that restores health and magic',
    category: 'consumable',
    rupeePrice: 100,
    isUnique: false,
  },
  {
    name: 'Fairy in a Bottle',
    description: 'A fairy captured in a bottle for emergency healing',
    category: 'consumable',
    rupeePrice: 80,
    isUnique: false,
  },
  {
    name: 'Deku Nut',
    description: 'A nut that stuns enemies with a flash of light',
    category: 'consumable',
    rupeePrice: 10,
    isUnique: false,
  },
  {
    name: 'Deku Stick',
    description: 'A wooden stick from a Deku tree',
    category: 'material',
    rupeePrice: 5,
    isUnique: false,
  },
  {
    name: 'Hylian Rice',
    description: 'A grain widely cultivated in Hyrule',
    category: 'material',
    rupeePrice: 12,
    isUnique: false,
  },
  {
    name: 'Mighty Bananas',
    description: 'Bananas that boost attack power when cooked',
    category: 'material',
    rupeePrice: 15,
    isUnique: false,
  },
  {
    name: 'Hearty Durian',
    description: 'A fruit that restores many hearts when cooked',
    category: 'material',
    rupeePrice: 60,
    isUnique: false,
  },
  {
    name: 'Ancient Screw',
    description: 'A screw from ancient Sheikah technology',
    category: 'material',
    rupeePrice: 30,
    isUnique: false,
  },
  {
    name: 'Soldier\'s Broadsword',
    description: 'A sword favored by Hyrulean soldiers',
    category: 'weapon',
    rupeePrice: 300,
    isUnique: false,
  },
  {
    name: 'Traveler\'s Shield',
    description: 'A sturdy shield for road-weary travelers',
    category: 'shield',
    rupeePrice: 150,
    isUnique: false,
  },
  {
    name: 'Rubber Armor',
    description: 'Armor made from ancient rubber, resistant to electricity',
    category: 'armor',
    rupeePrice: 800,
    isUnique: false,
  },
] as const;

// --- Warehouse Locations ---
const locationData = [
  // Villages
  { name: 'Kakariko Village', zone: 'village', capacity: 50 },
  { name: 'Hateno Village', zone: 'village', capacity: 50 },
  { name: 'Lurelin Village', zone: 'village', capacity: 30 },
  { name: 'Tarrey Town', zone: 'village', capacity: 40 },
  { name: 'Gerudo Town', zone: 'village', capacity: 50 },
  { name: 'Rito Village', zone: 'village', capacity: 30 },
  { name: 'Goron City', zone: 'village', capacity: 40 },
  { name: 'Zora\'s Domain', zone: 'village', capacity: 40 },
  { name: 'Korok Forest', zone: 'village', capacity: 30 },
  // Stables
  { name: 'Riverside Stable', zone: 'stable', capacity: 20 },
  { name: 'Dueling Peaks Stable', zone: 'stable', capacity: 20 },
  { name: 'Woodland Stable', zone: 'stable', capacity: 20 },
  { name: 'Foothill Stable', zone: 'stable', capacity: 20 },
  { name: 'Gerudo Canyon Stable', zone: 'stable', capacity: 20 },
  { name: 'Outskirt Stable', zone: 'stable', capacity: 20 },
  // Landmarks
  { name: 'Hyrule Castle', zone: 'landmark', capacity: 100 },
  { name: 'Great Plateau', zone: 'landmark', capacity: 60 },
  { name: 'Death Mountain', zone: 'landmark', capacity: 30 },
  { name: 'Lake Hylia', zone: 'landmark', capacity: 40 },
  { name: 'Hebra Mountains', zone: 'landmark', capacity: 30 },
] as const;

async function seed() {
  console.log('Seeding database...');

  // Insert characters
  const insertedCharacters = db
    .insert(characters)
    .values([...characterData])
    .returning()
    .all();
  console.log(`  Characters: ${insertedCharacters.length}`);

  // Insert items
  const insertedItems = db
    .insert(items)
    .values([...itemData])
    .returning()
    .all();
  console.log(`  Items: ${insertedItems.length}`);

  // Insert warehouse locations
  const insertedLocations = db
    .insert(warehouseLocations)
    .values([...locationData])
    .returning()
    .all();
  console.log(`  Warehouse Locations: ${insertedLocations.length}`);

  // Build lookup maps
  const charByName = new Map(insertedCharacters.map((c) => [c.name, c.id]));
  const itemByName = new Map(insertedItems.map((i) => [i.name, i.id]));
  const locByName = new Map(insertedLocations.map((l) => [l.name, l.id]));

  // --- Purchase Orders ---
  const poData: {
    poNumber: string;
    status: string;
    character: string;
    lines: {
      item: string;
      qtyOrdered: number;
      qtyReceived: number;
      location: string | null;
    }[];
  }[] = [
    {
      poNumber: 'PO-HYR-001',
      status: 'received',
      character: 'Beedle',
      lines: [
        {
          item: 'Arrow',
          qtyOrdered: 50,
          qtyReceived: 50,
          location: 'Kakariko Village',
        },
        {
          item: 'Bomb',
          qtyOrdered: 20,
          qtyReceived: 20,
          location: 'Hateno Village',
        },
        {
          item: 'Red Potion',
          qtyOrdered: 10,
          qtyReceived: 10,
          location: 'Riverside Stable',
        },
        {
          item: 'Deku Nut',
          qtyOrdered: 5,
          qtyReceived: 5,
          location: 'Dueling Peaks Stable',
        },
      ],
    },
    {
      poNumber: 'PO-HYR-002',
      status: 'partial',
      character: 'Link',
      lines: [
        {
          item: 'Master Sword',
          qtyOrdered: 1,
          qtyReceived: 1,
          location: 'Hyrule Castle',
        },
        {
          item: 'Hylian Shield',
          qtyOrdered: 1,
          qtyReceived: 1,
          location: 'Hyrule Castle',
        },
        {
          item: 'Arrow',
          qtyOrdered: 30,
          qtyReceived: 20,
          location: 'Great Plateau',
        },
        { item: 'Fire Arrow', qtyOrdered: 10, qtyReceived: 0, location: null },
        { item: 'Bomb', qtyOrdered: 5, qtyReceived: 0, location: null },
      ],
    },
    {
      poNumber: 'PO-HYR-003',
      status: 'partial',
      character: 'Zelda',
      lines: [
        {
          item: 'Ocarina of Time',
          qtyOrdered: 1,
          qtyReceived: 0,
          location: null,
        },
        {
          item: 'Blue Potion',
          qtyOrdered: 5,
          qtyReceived: 3,
          location: 'Gerudo Town',
        },
        {
          item: 'Hylian Rice',
          qtyOrdered: 10,
          qtyReceived: 10,
          location: 'Lurelin Village',
        },
        {
          item: 'Hearty Durian',
          qtyOrdered: 10,
          qtyReceived: 4,
          location: 'Tarrey Town',
        },
      ],
    },
    {
      poNumber: 'PO-HYR-004',
      status: 'pending',
      character: 'Impa',
      lines: [
        {
          item: 'Fierce Deity Mask',
          qtyOrdered: 1,
          qtyReceived: 0,
          location: null,
        },
        { item: 'Shock Arrow', qtyOrdered: 20, qtyReceived: 0, location: null },
        {
          item: 'Ancient Screw',
          qtyOrdered: 15,
          qtyReceived: 0,
          location: null,
        },
        {
          item: 'Fairy in a Bottle',
          qtyOrdered: 3,
          qtyReceived: 0,
          location: null,
        },
      ],
    },
    {
      poNumber: 'PO-HYR-005',
      status: 'pending',
      character: 'Ganondorf',
      lines: [
        {
          item: 'Biggoron Sword',
          qtyOrdered: 1,
          qtyReceived: 0,
          location: null,
        },
        {
          item: 'Mirror Shield',
          qtyOrdered: 1,
          qtyReceived: 0,
          location: null,
        },
        { item: 'Bombchu', qtyOrdered: 10, qtyReceived: 0, location: null },
        {
          item: 'Mighty Bananas',
          qtyOrdered: 5,
          qtyReceived: 0,
          location: null,
        },
      ],
    },
    {
      poNumber: 'PO-HYR-006',
      status: 'received',
      character: 'Sidon',
      lines: [
        {
          item: 'Ice Arrow',
          qtyOrdered: 20,
          qtyReceived: 20,
          location: 'Zora\'s Domain',
        },
        {
          item: 'Blue Potion',
          qtyOrdered: 3,
          qtyReceived: 3,
          location: 'Rito Village',
        },
        {
          item: 'Red Potion',
          qtyOrdered: 5,
          qtyReceived: 5,
          location: 'Woodland Stable',
        },
      ],
    },
    {
      poNumber: 'PO-HYR-007',
      status: 'partial',
      character: 'Purah',
      lines: [
        {
          item: 'Ancient Screw',
          qtyOrdered: 25,
          qtyReceived: 15,
          location: 'Goron City',
        },
        {
          item: 'Shock Arrow',
          qtyOrdered: 5,
          qtyReceived: 5,
          location: 'Foothill Stable',
        },
        {
          item: 'Rubber Armor',
          qtyOrdered: 3,
          qtyReceived: 1,
          location: 'Gerudo Canyon Stable',
        },
        {
          item: 'Soldier\'s Broadsword',
          qtyOrdered: 2,
          qtyReceived: 0,
          location: null,
        },
        {
          item: 'Traveler\'s Shield',
          qtyOrdered: 4,
          qtyReceived: 0,
          location: null,
        },
      ],
    },
  ];

  let poCount = 0;
  let lineCount = 0;

  // Track PO IDs and PO item IDs for receipt seeding
  const poIdByNumber = new Map<string, number>();
  const poItemIdMap = new Map<string, Map<string, number>>();

  for (const po of poData) {
    const [insertedPo] = db
      .insert(purchaseOrders)
      .values({
        poNumber: po.poNumber,
        status: po.status,
        characterId: charByName.get(po.character)!,
      })
      .returning()
      .all();
    poCount++;

    const lineMap = new Map<string, number>();
    poIdByNumber.set(po.poNumber, insertedPo.id);

    for (const line of po.lines) {
      const [insertedLine] = db.insert(purchaseOrderItems)
        .values({
          purchaseOrderId: insertedPo.id,
          itemId: itemByName.get(line.item)!,
          quantityOrdered: line.qtyOrdered,
          quantityReceived: line.qtyReceived,
          warehouseLocationId: line.location
            ? locByName.get(line.location)!
            : null,
        })
        .returning()
        .all();
      lineMap.set(line.item, insertedLine.id);
      lineCount++;
    }

    poItemIdMap.set(po.poNumber, lineMap);
  }

  console.log(`  Purchase Orders: ${poCount}`);
  console.log(`  Purchase Order Items: ${lineCount}`);

  // --- Receipts ---
  const receiptData: {
    receiptNumber: string;
    poNumber: string;
    notes: string | null;
    lines: { item: string; qtyReceived: number; isReceived: boolean }[];
  }[] = [
    {
      receiptNumber: 'REC-HYR-001',
      poNumber: 'PO-HYR-001',
      notes: 'Full shipment received from Beedle',
      lines: [
        { item: 'Arrow', qtyReceived: 50, isReceived: true },
        { item: 'Bomb', qtyReceived: 20, isReceived: true },
        { item: 'Red Potion', qtyReceived: 10, isReceived: true },
        { item: 'Deku Nut', qtyReceived: 5, isReceived: true },
      ],
    },
    {
      receiptNumber: 'REC-HYR-002',
      poNumber: 'PO-HYR-002',
      notes: 'Partial shipment — arrows short, fire arrows and bombs pending',
      lines: [
        { item: 'Master Sword', qtyReceived: 1, isReceived: true },
        { item: 'Hylian Shield', qtyReceived: 1, isReceived: true },
        { item: 'Arrow', qtyReceived: 20, isReceived: false },
      ],
    },
    {
      receiptNumber: 'REC-HYR-003',
      poNumber: 'PO-HYR-003',
      notes: 'Partial shipment — ocarina still missing',
      lines: [
        { item: 'Hylian Rice', qtyReceived: 10, isReceived: true },
        { item: 'Blue Potion', qtyReceived: 3, isReceived: false },
        { item: 'Hearty Durian', qtyReceived: 4, isReceived: false },
      ],
    },
    {
      receiptNumber: 'REC-HYR-004',
      poNumber: 'PO-HYR-006',
      notes: 'Full shipment received from Sidon',
      lines: [
        { item: 'Ice Arrow', qtyReceived: 20, isReceived: true },
        { item: 'Blue Potion', qtyReceived: 3, isReceived: true },
        { item: 'Red Potion', qtyReceived: 5, isReceived: true },
      ],
    },
    {
      receiptNumber: 'REC-HYR-005',
      poNumber: 'PO-HYR-007',
      notes: 'Partial shipment — broadswords and shields pending',
      lines: [
        { item: 'Ancient Screw', qtyReceived: 15, isReceived: false },
        { item: 'Shock Arrow', qtyReceived: 5, isReceived: true },
        { item: 'Rubber Armor', qtyReceived: 1, isReceived: false },
      ],
    },
  ];

  let receiptCount = 0;
  let receiptLineCount = 0;

  for (const rec of receiptData) {
    const [insertedReceipt] = db
      .insert(receipts)
      .values({
        receiptNumber: rec.receiptNumber,
        purchaseOrderId: poIdByNumber.get(rec.poNumber)!,
        notes: rec.notes,
      })
      .returning()
      .all();
    receiptCount++;

    const poItemMap = poItemIdMap.get(rec.poNumber)!;

    for (const line of rec.lines) {
      db.insert(receiptLines)
        .values({
          receiptId: insertedReceipt.id,
          purchaseOrderItemId: poItemMap.get(line.item)!,
          quantityReceived: line.qtyReceived,
          isReceived: line.isReceived,
        })
        .run();
      receiptLineCount++;
    }
  }

  console.log(`  Receipts: ${receiptCount}`);
  console.log(`  Receipt Lines: ${receiptLineCount}`);
  console.log('Done!');
}

seed();
