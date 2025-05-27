CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_hybrid" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"userId" text NOT NULL,
	"activeOrganizationId" text,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_hybrid_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "session_hybrid" ADD CONSTRAINT "session_hybrid_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_hybrid" ADD CONSTRAINT "session_hybrid_activeOrganizationId_organization_id_fk" FOREIGN KEY ("activeOrganizationId") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;