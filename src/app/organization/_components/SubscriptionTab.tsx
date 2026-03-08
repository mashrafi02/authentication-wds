"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { PLAN_TO_PRICE, STRIPE_PLAN } from "@/lib/auth/stripe";
import { Subscription } from "@better-auth/stripe";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import currencyFormatter from "currency-formatter";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";


export default function SubscriptionTab() {
    const { data: activeOrganization } = authClient.useActiveOrganization();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        if (activeOrganization == null) {
            return setSubscriptions([])
        }

        authClient.subscription
            .list({ query: { referenceId: activeOrganization.id } })
            .then(result => {
                if( result.error ){
                    setSubscriptions([])
                    toast.error("Failed to load subscriptions")
                    return
                }

                setSubscriptions(result?.data)
            })
    }, [activeOrganization]);

    const activeSubscription = subscriptions.find(
        sub => sub.status === "active" || sub.status === "trialing"
    );

    // console.log("active-subscription", activeSubscription);

    const activePlan = STRIPE_PLAN.find(
        plan => plan.name === activeSubscription?.plan
    );

    // console.log("active-plan", activePlan);
    

    async function handleBillingPortal() {
        if(activeOrganization == null) {
            return { error: { message: "No active Organization" } }
        }

        const res = await authClient.subscription.billingPortal({
            referenceId: activeOrganization.id,
            returnUrl: window.location.href
        })

        if( res.error == null ){
            window.location.href = res.data.url
        }

        return res
    }

    async function handleCancelSubscription() {
        if(activeOrganization == null) {
            return Promise.resolve({ error: { message: "No active organization" } })
        }
    
        if(activeSubscription == null) {
            return Promise.resolve({ error: { message: "No active subscription" } })
        }
    
        const res = await authClient.subscription.cancel({
            subscriptionId: activeSubscription.stripeSubscriptionId,
            referenceId: activeOrganization.id,
            returnUrl: window.location.href
        })
    
        // Re-fetch subscriptions to update UI state
        if(res.error == null) {
            const result = await authClient.subscription.list({ 
                query: { referenceId: activeOrganization.id } 
            })
            console.log("re-fetched subscriptions", result.data)
            if(result.data) {
                setSubscriptions(result.data)
            }
        }

        // setSubscriptions(prev => prev.map(sub => 
        //     sub.stripeSubscriptionId === activeSubscription.stripeSubscriptionId
        //         ? { ...sub, cancelAtPeriodEnd: true }
        //         : sub
        // ))
    
        return res
    }

    async function handleSubscriptionChange(plan: string) {
        if(activeOrganization == null) {
            return Promise.resolve({error: { message: "No active organization" }})
        }
    
        const res = await authClient.subscription.upgrade({
            plan,
            subscriptionId: activeSubscription?.stripeSubscriptionId,
            referenceId: activeOrganization.id,
            returnUrl: window.location.href,
            successUrl: window.location.href,
            cancelUrl: window.location.href
        })
    
        // Re-fetch subscriptions to update UI state
        if(res.error == null) {
            const result = await authClient.subscription.list({ 
                query: { referenceId: activeOrganization.id } 
            })
            if(result.data) {
                setSubscriptions(result.data)
            }
        }
    
        return res
    }

    return (
        <div className="space-y-6">
            {activeSubscription && activePlan && (
                <Card>
                    <CardHeader>
                        <CardTitle>Current Subscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold capitalize">
                                        {activeSubscription.plan} Plan
                                    </h3>
                                    {
                                        activeSubscription.priceId && (
                                            <Badge variant={"secondary"}>
                                                {
                                                    currencyFormatter.format(
                                                        PLAN_TO_PRICE[activeSubscription.plan], { code: 'USD' }
                                                    )
                                                }
                                            </Badge>
                                        )
                                    }
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {activePlan.limits.projects} projects included
                                </p>
                                {
                                    activeSubscription.periodEnd && (
                                        <p className="text-sm text-muted-foreground">
                                            {activeSubscription.cancelAtPeriodEnd ? "Cancels on" : "Renews on"}
                                            {activeSubscription.periodEnd?.toLocaleDateString()}
                                        </p>
                                    )
                                }
                            </div>
                            <ActionButton
                                variant={"outline"}
                                action={handleBillingPortal}
                                className="flex items-center gap-2">
                                Billing Portal
                            </ActionButton>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {
                    STRIPE_PLAN.map(plan => (
                        <Card key={plan.name} className="relative">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl capitalize">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {currencyFormatter.format(PLAN_TO_PRICE[plan.name], { code: 'USD' })}
                                        </div>
                                    </div>
                                </div>
                                <CardDescription>
                                    Up to {plan.limits.projects} projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeSubscription?.plan === plan.name ? (
                                    activeSubscription.cancelAtPeriodEnd ? (
                                        <Button disabled variant={"outline"} className="w-full">
                                            Current Plan
                                        </Button>
                                    ) : (
                                        <ActionButton
                                            variant={"destructive"}
                                            className="w-full"
                                            action={handleCancelSubscription}>
                                            Cancel Subscription
                                        </ActionButton>
                                    )
                                ) : (
                                    <ActionButton
                                        action={() => handleSubscriptionChange(plan.name)}>
                                        {activeSubscription === null ? "Subscribe" : "Change Plan"}
                                    </ActionButton>
                                )}
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}