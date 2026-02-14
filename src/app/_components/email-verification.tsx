"use client"

import { ActionButton } from "@/components/ActionButton"
import { authClient } from "@/lib/auth/auth-client"
import { useEffect, useRef, useState } from "react"


const EmailVerification = ({email}:{email:string}) => {
    const [timeToNextResend, setTimeToNextResend] = useState(60);
    const interval = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        startEmailVerificationCountdown()
    }, [])

    function startEmailVerificationCountdown(time=60){
        setTimeToNextResend(time);
        interval.current = setInterval(() => {
            setTimeToNextResend(t => {
                const newT = t - 1;
                if(t <= 1) {
                    clearInterval(interval.current)
                    return 0
                }
                return newT
            })
        },1000)
    }

  return (
    <div className="space-y-4">
        <p className="text-sm text-muted-foreground mt-2">A verication email has been sent to to your email {email}</p>
        <ActionButton
            variant={"outline"}
            disabled={timeToNextResend > 0}
            action={() => {
                startEmailVerificationCountdown();
                authClient.sendVerificationEmail({email, callbackURL: '/'})
            }}
            successMessage="email sent successfully">
            {
                timeToNextResend > 0
                ? `Resend Email (${timeToNextResend})`
                : 'Resend Email'
            }
        </ActionButton>
    </div>
  )
}

export default EmailVerification