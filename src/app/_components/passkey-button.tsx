"use client"

import { ActionButton } from "@/components/ActionButton";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function PasskeyButton() {

    const router = useRouter();
    const { refetch } = authClient.useSession()

    useEffect(() => {
        authClient.signIn.passkey(
            {autoFill: true},
            {
                onSuccess : () => {
                    refetch();
                    router.push("/")
                }
            })
    }, [router, refetch])

    return (
        <ActionButton
            variant={"outline"}
            className="w-full"
            action={ () => {
                authClient.signIn.passkey(undefined, {
                    onSuccess : () => {
                        refetch();
                        router.push("/")
                    }
                })
            }}>
            Use Passkey
        </ActionButton>
    )
}