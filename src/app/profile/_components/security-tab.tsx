import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import SetPasswordButton from "./security-tab-components/SetPasswordButton";
import ChangePasswordForm from "./security-tab-components/change-password-form";
import { Badge } from "@/components/ui/badge";
import TwoFactorAuth from "./security-tab-components/tow-factor-auth";



export default async function SecurityTab ({ email, isTwoFactorEnabled } : { email: string, isTwoFactorEnabled: boolean }) {
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
            {
                hasPasswordAccount && (
                    <Card>
                        <CardHeader className="flex items-center justify-between gap-2">
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <Badge
                                variant={ isTwoFactorEnabled ? "default" : "secondary" }>
                                    { isTwoFactorEnabled ? "Enabled" : "Disabled" }
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}