"use client"

import { ActionButton } from "@/components/ActionButton"
import { authClient } from "@/lib/auth/auth-client"


const SetPasswordButton = ({ email }: { email: string }) => {
  return (
    <ActionButton variant={"outline"}
        successMessage="Password reset email sent"
        action={() => {
            return authClient.requestPasswordReset({
                email,
                redirectTo: "/auth/reset-password"
            })
        }}>
        Send Password reset email
    </ActionButton>
  )
}

export default SetPasswordButton