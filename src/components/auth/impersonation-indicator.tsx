"use client"

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation"
import { ActionButton } from "../ActionButton";
import { UserX } from "lucide-react";

export function ImpersonationIndicator() {
    const router = useRouter();
    const { data: session, refetch } = authClient.useSession();

    if( session?.session.impersonatedBy == null ) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <ActionButton
                action={ () => 
                    authClient.admin.stopImpersonating(undefined, {
                        onSuccess: () => {
                            router.push("/admin");
                            refetch()
                        }
                    })
                }>
                <UserX className="size-4" />
            </ActionButton>
        </div>
    )
}