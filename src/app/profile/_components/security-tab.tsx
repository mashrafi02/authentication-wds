import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import SetPasswordButton from "./security-tab-components/SetPasswordButton";
import ChangePasswordForm from "./security-tab-components/change-password-form";



export default async function SecurityTab ({ email } : { email: string }) {
    const accounts = await auth.api.listUserAccounts({ headers: await headers() });
    const hasPasswordAccount =  accounts.some(acc => acc.providerId === "credential");

    return (
        <div className="space-y-6">
            {
                hasPasswordAccount ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                        </CardHeader>
                        <CardDescription className="ml-6">
                            Update your password for impoved security.
                        </CardDescription>
                        <CardContent>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>
                ): (
                    <Card>
                        <CardHeader>
                            <CardTitle>Set Password</CardTitle>
                        </CardHeader>
                        <CardDescription className="ml-6">
                            We will send you a password reset email to set up a password.
                        </CardDescription>
                        <CardContent>
                            <SetPasswordButton email={email}/>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}