CREATE TABLE "checkout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"polar_checkout_id" text UNIQUE,
	"lines" jsonb NOT NULL,
	"total_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_cents" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"polar_checkout_id" text,
	"polar_order_id" text UNIQUE,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"image_url" text,
	"image_kit_file_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_user_id" text NOT NULL UNIQUE,
	"email" text DEFAULT '' NOT NULL,
	"display_name" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;