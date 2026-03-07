import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { BETTER_AUTH_BASE_URL, BETTER_AUTH_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../../../constants";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { sendPasswordResetEmail } from "../emails/sendPasswordResetEmail";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/sendWelcomeEmail";
import { sendDelteAccountVerificationEmail } from "../emails/sendDelteAccountVerificationEmail";
import { organization, twoFactor } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { passkey } from "@better-auth/passkey"
import { user, ac, admin } from "@/components/auth/permissions";
import { sendOrganizationInviteEmail } from "../emails/sendOrganizationInviteEmail";
import { desc, eq } from "drizzle-orm";
import { member } from "@/db/schemas/auth-schema";


export const auth = betterAuth({
  appName:"Better Auth WDS",
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ( { user, url, newEmail } ) => {
        await sendVerificationEmail(user={...user, email:newEmail}, url )
      }
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDelteAccountVerificationEmail( user, url )
      }
    },
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
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    adminPlugin({
      ac,
      roles: {admin, user}
    }),
    organization({
      sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email
        })
      }
    }) // you can setup same things in organization as the adminPlugin
  ],
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
  },
  databaseHooks: {
    session: {
      create: {
        before: async userSession => {
          const membership = await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns: { organizationId: true }
          })

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId
            }
          }
        }
      }
    }
  } 
});