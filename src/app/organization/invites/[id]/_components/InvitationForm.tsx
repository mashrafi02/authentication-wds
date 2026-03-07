"use client"

import { ActionButton } from "@/components/ActionButton"
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation"


export default function InvitationForm({
    invitation
}: {
    invitation: { id: string, organizationId: string }
}){

    const router = useRouter();
    
    function acceptInvite() {
        return authClient.organization.acceptInvitation({
            invitationId: invitation.id,
        }, { onSuccess: async () => {
            await authClient.organization.setActive({
                organizationId: invitation.organizationId
            })
            router.push("/organization")
        }})
    };

    function rejectInvite() {
        return authClient.organization.rejectInvitation({
            invitationId: invitation.id,
        }, { onSuccess: () => router.push("/")})
    }

    return (
        <div className="flex gap-4">
            <ActionButton className="flex-grow"
                action={acceptInvite}>
                    Accept
            </ActionButton>
            <ActionButton className="felx-grow"
                variant={"destructive"}
                action={rejectInvite}>
                Reject
            </ActionButton>
        </div>
    )
}