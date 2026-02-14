import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { BETTER_AUTH_BASE_URL, BETTER_AUTH_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../../../constants";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { sendPasswordResetEmail } from "../emails/sendPasswordResetEmail";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/sendWelcomeEmail";


export const auth = betterAuth({
  user: {
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true
      }
    }
  },
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification:true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail( user, url )
    },
    resetPasswordTokenExpiresIn: 60 * 5, 
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user, url)
    },
    expiresIn: 60*60
  },
  socialProviders: {
    github: { 
        clientId: GITHUB_CLIENT_ID as string,
        clientSecret: GITHUB_CLIENT_SECRET as string,
        mapProfileToUser: (profile) => {
          return {
            favoriteNumber: Number(profile.public_repos) || 0
          }
        }
    }, 
    discord: { 
        clientId: DISCORD_CLIENT_ID as string, 
        clientSecret: DISCORD_CLIENT_SECRET as string, 
        mapProfileToUser: () => {
          return {
            favoriteNumber:0
          }
        }
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
  hooks: {
    after: createAuthMiddleware( async ctx => {
        if (ctx.path.startsWith("/sign-up")) {
          const user = ctx.context.newSession?.user ?? {
            name : ctx.body.name,
            email : ctx.body.email
          }

          if(user != null) {
            await sendWelcomeEmail(user)
          }
        }
    })
  } 
});