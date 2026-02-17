import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth"
import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/auth/o-auth-provider";
import AccountCard from "./AccountCard";


type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

const AccountLinking = ({
    currentAccounts
}: {
    currentAccounts : Account[]
}) => {
  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-lg font-medium">Linked Accounts</h3>

            {
                currentAccounts.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No linked accounts found
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {
                            currentAccounts.map( account => (
                                <AccountCard 
                                    key={account.id}
                                    provider={account.providerId}
                                    account={account}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-medium">Link Other Accounts</h3>
            <div className="grid gap-3">
                {
                    SUPPORTED_OAUTH_PROVIDERS.filter(
                        provider => !currentAccounts.find(acc => acc.providerId === provider)
                    ).map(provider => (
                        <AccountCard key={provider} provider={provider} />
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default AccountLinking