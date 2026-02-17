"use client"

import { ActionButton } from "@/components/ActionButton"
import { authClient } from "@/lib/auth/auth-client"


const AccountDeletion = () => {
  return (
    <ActionButton 
        requireAreYouSure
        variant={"destructive"}
        successMessage="Account deletion initiated. Please check your email to confirm"
        action={() => authClient.deleteUser({ callbackURL: '/'})}    
    >
        Delete Account Permanently
    </ActionButton>
  )
}

export default AccountDeletion