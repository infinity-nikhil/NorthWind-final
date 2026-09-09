import { pgTable, text, integer, timestamp, uuid, boolean, jsonb } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export type OrderStatus = "pending" | "paid" | "failed";
export type UserRole = "customer" | "support" | "admin";

export type CheckoutSessionLine = {
  productId: string;
  quantity: number;
  unitPriceCents: number;
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().default(""),
  displayName: text("display_name"),
  role: text("role").$type<UserRole>().notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull().default("General"),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  imageUrl: text("image_url"),
  imageKitFileId: text("image_kit_file_id"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const checkoutSessions = pgTable("checkout_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  polarCheckoutId: text("polar_checkout_id").unique(),
  lines: jsonb("lines").$type<CheckoutSessionLine[]>().notNull(),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").$type<OrderStatus>().notNull().default("pending"),
  polarCheckoutId: text("polar_checkout_id"),
  polarOrderId: text("polar_order_id").unique(),
  totalCents: integer("total_cents").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

// cascade = "delete children when parent is deleted"; restrict = "don't delete the parent if any child still points at it."

const schema = { users, products, checkoutSessions, orders, orderItems };

export const relations = defineRelations(schema, (r) => ({
  users: {
    orders: r.many.orders(),
  },
  products: {
    orderItems: r.many.orderItems(),
  },
  orders: {
    user: r.one.users({
      from: r.orders.userId,
      to: r.users.id,
    }),
    items: r.many.orderItems(),
  },
  orderItems: {
    order: r.one.orders({
      from: r.orderItems.orderId,
      to: r.orders.id,
    }),
    product: r.one.products({
      from: r.orderItems.productId,
      to: r.products.id,
    }),
  },
}));