import { StripePlan } from "@better-auth/stripe";
import { STRIPE_BASIC_PRICE_ID, STRIPE_PRO_PRICE_ID } from "../../../constants";



export const STRIPE_PLAN = [
    {
        name: "basic",
        priceId: STRIPE_BASIC_PRICE_ID,
        limits: {
            projects: 10
        }
    },
    {
        name: "pro",
        priceId: STRIPE_PRO_PRICE_ID,
        limits: {
            projects: 50
        }
    }
] as const satisfies StripePlan[]


export const PLAN_TO_PRICE: Record<string, number> = {
    basic: 19,
    pro: 49,
}