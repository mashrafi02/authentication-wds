import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { BETTER_AUTH_BASE_URL, BETTER_AUTH_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../../constants";

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
    github: { 
        clientId: GITHUB_CLIENT_ID as string,
        clientSecret: GITHUB_CLIENT_SECRET as string
    }, 
    discord: { 
        clientId: DISCORD_CLIENT_ID as string, 
        clientSecret: DISCORD_CLIENT_SECRET as string, 
    },
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