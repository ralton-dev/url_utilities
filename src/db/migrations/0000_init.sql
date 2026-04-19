CREATE TABLE "qr_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"url_id" integer,
	"qr_code" text
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text,
	"alias" varchar(10),
	"count" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;