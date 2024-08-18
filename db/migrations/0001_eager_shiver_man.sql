ALTER TABLE "user" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "verificationToken" ADD COLUMN "email" text NOT NULL;