ALTER TABLE "user" RENAME COLUMN "role" TO "roles";--> statement-breakpoint
ALTER TABLE "twoFaToken" ADD COLUMN "UserId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twoFaToken" ADD CONSTRAINT "twoFaToken_UserId_user_id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
