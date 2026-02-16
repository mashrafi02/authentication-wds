"use client"

import { Session } from "better-auth"
import SessionCard from "./SessionCard";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";


const SessionManagement = ({
    sessions,
    currentSessionToken
}: {
    sessions: Session[],
    currentSessionToken: string
}) => {

    const router = useRouter();

    const otherSessions = sessions.filter(s => s.token !== currentSessionToken);
    const currentSession = sessions.filter(s => s.token === currentSessionToken)[0];


    function revokeOtherSessions () {
        return authClient.revokeOtherSessions(undefined, {
            onSuccess: () => {
                router.refresh()
            }
        })
    }

    
  return (
    <div className="space-y-6">
        {
            currentSession && (
                <SessionCard session={currentSession} isCurrentSession/>
            )
        }
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Other Active Sessions</h3>
                {
                    otherSessions.length > 0 && (
                        <ActionButton
                        variant={"destructive"}
                        size={"sm"}
                        action={revokeOtherSessions}>
                            Revoke Other Sessions
                        </ActionButton>
                    )
                }
            </div>
            {
                otherSessions.length < 1 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No other active sessions
                        </CardContent>
                    </Card>
                ): (
                    <div className="space-y-3">
                        {
                            otherSessions.map(s => (
                                <SessionCard
                                key={s.id}
                                session={s}
                                isCurrentSession={false} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default SessionManagement