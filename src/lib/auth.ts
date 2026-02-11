import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { BETTER_AUTH_BASE_URL, BETTER_AUTH_SECRET } from "../../constants";

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  session: {
    cookieCache: {
        enabled: true,
        maxAge: 60
    }
  },
  plugins: [nextCookies()],
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_BASE_URL,
  database: drizzleAdapter(db, { 
    provider: "pg", 
  }), 
});