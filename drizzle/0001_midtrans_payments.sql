CREATE TABLE "payment_session" (
	"id" text PRIMARY KEY NOT NULL,
	"checkout_group_id" text NOT NULL,
	"provider" text DEFAULT 'midtrans' NOT NULL,
	"provider_order_id" text NOT NULL,
	"provider_transaction_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_payment_method" text NOT NULL,
	"payment_type" text,
	"transaction_status" text,
	"fraud_status" text,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"gross_amount" integer NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_name" text,
	"expires_at" timestamp,
	"paid_at" timestamp,
	"last_notified_at" timestamp,
	"last_webhook_event_key" text,
	"last_webhook_payload" json,
	"charge_request" json,
	"charge_response" json,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_webhook_event" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text DEFAULT 'midtrans' NOT NULL,
	"provider_order_id" text NOT NULL,
	"event_key" text NOT NULL,
	"event_type" text,
	"payload" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "cancelled_at" timestamp;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
CREATE INDEX "payment_session_checkout_group_id_idx" ON "payment_session" USING btree ("checkout_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_session_provider_order_id_unique" ON "payment_session" USING btree ("provider","provider_order_id");--> statement-breakpoint
CREATE INDEX "payment_session_status_idx" ON "payment_session" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_session_provider_transaction_id_idx" ON "payment_session" USING btree ("provider_transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_webhook_event_provider_key_unique" ON "payment_webhook_event" USING btree ("provider","event_key");--> statement-breakpoint
CREATE INDEX "payment_webhook_event_provider_order_id_idx" ON "payment_webhook_event" USING btree ("provider_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_idempotency_key_unique" ON "transaction" USING btree ("idempotency_key");