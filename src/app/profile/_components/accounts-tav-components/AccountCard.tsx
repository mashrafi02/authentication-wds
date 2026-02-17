"use client"

import { ActionButton } from "@/components/ActionButton"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SupportedOAuthProvider } from "@/lib/auth/o-auth-provider"
import { Account } from "better-auth"
import { Plus, Shield, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"



const AccountCard = ({
    provider,
    account
}:{
    provider:string,
    account?: Account
}) => {

    const router = useRouter()

    const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider as SupportedOAuthProvider] ?? {
        name: provider,
        Icon: Shield
    }

    function linkAccount () {
        return authClient.linkSocial({
            provider,
            callbackURL: "/profile"
        })
    }

    function unlinkAccount() {
        if( account == null ) {
            return Promise.resolve({ error: {message: "Account not found"}})
        }
        return authClient.unlinkAccount({
            accountId: account.accountId,
            providerId: provider,
        },{
            onSuccess: () => {
                router.refresh()
            }
        })
    }
  return (
    <Card>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {<providerDetails.Icon className="size-5" />}
                    <p className="font-medium">{providerDetails.name}</p>
                    {account == null ? (
                        <p className="text-sm text-muted-foreground">
                            Connect your {providerDetails.name} account for easier sign-in
                        </p>
                    ):(
                        <p className="text-sm text-muted-foreground">
                        Linked on {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                    )}
                </div>
                {
                    account == null ? (
                        <ActionButton 
                            variant={"outline"}
                            size={"sm"}
                            action={linkAccount}>
                                <div className="flex items-center gap-x-2">
                                    <Plus />
                                    Link
                                </div>
                        </ActionButton>
                    ):(
                        <ActionButton 
                            variant={"destructive"}
                            size={"sm"}
                            action={unlinkAccount}>
                                <div className="flex items-center gap-x-2">
                                    <Trash2 />
                                    Unlink
                                </div>
                        </ActionButton>
                    )
                }
            </div>
        </CardContent>
    </Card>
  )
}

export default AccountCard