import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import AccountLinking from "./accounts-tav-components/AccountLinking";


const AccountsTab = async () => {

    const accounts = await auth.api.listUserAccounts({ headers: await headers() });
    const nonCredentialAccounts = accounts.filter( acc => acc.providerId !== "credential" );

  return (
    <Card>
        <CardContent>
            <AccountLinking currentAccounts = {nonCredentialAccounts} />
        </CardContent>
    </Card>
  )
}

export default AccountsTab