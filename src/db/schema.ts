import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * Represents the 'users' table in the database.
 */
export const users = pgTable("user", {
  /**
   * The unique identifier for the user (UUID, auto-generated).
   */
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  /**
   * The name of the user.
   */
  name: text("name"),
  /**
   * The email address of the user (must be unique).
   */
  email: text("email").unique(),
  /**
   * Timestamp indicating when the user's email was verified.
   */
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  /**
   * URL of the user's profile image.
   */
  image: text("image"),
});

/**
 * Represents the 'accounts' table, typically used for OAuth provider information.
 */
export const accounts = pgTable(
  "account",
  {
    /**
     * Foreign key referencing the 'users' table.
     */
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /**
     * The type of the account (e.g., 'oauth', 'credentials').
     * TODO: Replace 'text' with the actual AdapterAccountType if available.
     */
    type: text("type").notNull(), // placeholder for AdapterAccountType
    /**
     * The OAuth provider (e.g., 'google', 'github').
     */
    provider: text("provider").notNull(),
    /**
     * The user's ID as provided by the OAuth provider.
     */
    providerAccountId: text("providerAccountId").notNull(),
    /**
     * The refresh token, if applicable.
     */
    refresh_token: text("refresh_token"),
    /**
     * The access token, if applicable.
     */
    access_token: text("access_token"),
    /**
     * Timestamp indicating when the access token expires.
     */
    expires_at: integer("expires_at"),
    /**
     * The type of the token (e.g., 'bearer').
     */
    token_type: text("token_type"),
    /**
     * The scope of access granted by the OAuth provider.
     */
    scope: text("scope"),
    /**
     * The ID token, if applicable (typically with OpenID Connect).
     */
    id_token: text("id_token"),
    /**
     * The session state, if applicable.
     */
    session_state: text("session_state"),
  },
  (account) => ({
    /**
     * Composite primary key on provider and providerAccountId to ensure uniqueness.
     */
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

/**
 * Represents the 'sessions' table for managing user sessions.
 */
export const sessions = pgTable("session", {
  /**
   * The unique session token (primary key).
   */
  sessionToken: text("sessionToken").primaryKey(),
  /**
   * Foreign key referencing the 'users' table.
   */
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  /**
   * Timestamp indicating when the session expires.
   */
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Represents the 'verificationTokens' table, used for email verification, password reset, etc.
 */
export const verificationTokens = pgTable(
  "verificationToken",
  {
    /**
     * The identifier for the token (e.g., email address).
     */
    identifier: text("identifier").notNull(),
    /**
     * The unique verification token.
     */
    token: text("token").notNull(),
    /**
     * Timestamp indicating when the token expires.
     */
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    /**
     * Composite primary key on identifier and token.
     */
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

/**
 * Represents the 'authenticators' table, typically for WebAuthn or other multi-factor authentication methods.
 */
export const authenticators = pgTable(
  "authenticator",
  {
    /**
     * The unique ID for the credential.
     */
    credentialID: text("credentialID").notNull().unique(),
    /**
     * Foreign key referencing the 'users' table.
     */
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /**
     * The provider account ID associated with this authenticator.
     */
    providerAccountId: text("providerAccountId").notNull(), // This was in the example, ensure it's needed.
    /**
     * The public key of the credential.
     */
    credentialPublicKey: text("credentialPublicKey").notNull(),
    /**
     * The counter value for the credential, used to prevent replay attacks.
     */
    counter: integer("counter").notNull(),
    /**
     * The type of the credential device (e.g., 'usb', 'nfc').
     */
    credentialDeviceType: text("credentialDeviceType").notNull(),
    /**
     * Boolean indicating if the credential has been backed up.
     */
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    /**
     * List of transport methods for the authenticator (e.g., 'usb', 'internal').
     */
    transports: text("transports"), // Consider if this should be an array type if your DB supports it and Drizzle allows.
  },
  (authenticator) => ({
    /**
     * Composite primary key on userId and credentialID.
     */
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);
