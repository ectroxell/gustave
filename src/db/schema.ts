import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  title: text("title").notNull(),
  race: text("race").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  rupeePrice: integer("rupee_price").notNull(),
  isUnique: integer("is_unique", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const warehouseLocations = sqliteTable("warehouse_locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  zone: text("zone").notNull(),
  capacity: integer("capacity").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const purchaseOrders = sqliteTable("purchase_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  poNumber: text("po_number").notNull().unique(),
  status: text("status").notNull(),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const purchaseOrderItems = sqliteTable("purchase_order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseOrderId: integer("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  quantityOrdered: integer("quantity_ordered").notNull(),
  quantityReceived: integer("quantity_received").notNull().default(0),
  warehouseLocationId: integer("warehouse_location_id").references(
    () => warehouseLocations.id
  ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
