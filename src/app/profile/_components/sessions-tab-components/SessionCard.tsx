"use client"

import { ActionButton } from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { Session } from "better-auth"
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js"


const SessionCard = ({
    session,
    isCurrentSession = false
}: {
    session: Session,
    isCurrentSession?: boolean
}) => {

    const router = useRouter();

    const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

    function getBrowserInformation() {
        if( userAgentInfo == null) return "Unknown Device";
        if( userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
            return "unknown device"
        }

        if( userAgentInfo.browser.name == null ) return userAgentInfo.os.name;
        if( userAgentInfo.os.name == null) return userAgentInfo.browser.name

        return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`
    }

    function formatDate( date: Date ) {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date))
    }

    function revokeSession() {
        return authClient.revokeSession(
            {
                token: session.token,
            },
            {
                onSuccess: () => {
                    router.refresh()
                }
            }
        )
    }
    
  return (
    <Card>
        <CardHeader className="flex justify-between">
            <CardTitle className="flex items-center gap-3">
                { getBrowserInformation() }
                { isCurrentSession && <Badge>Current Session</Badge> }
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {
                        userAgentInfo?.device.type === "mobile" ? (
                            <Smartphone />
                        ) : (
                            <Monitor />
                        )
                    }
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Created: { formatDate(session.createdAt)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Expires: { formatDate(session.expiresAt)}
                        </p>
                    </div>
                </div>
                {
                    !isCurrentSession && (
                        <ActionButton
                            variant={"destructive"}
                            size={"sm"}
                            action={() => {
                                revokeSession()
                            }}
                            successMessage="Session revoked">
                                <Trash2 />
                        </ActionButton>
                    )
                }
            </div>
        </CardContent>
    </Card>
  )
}

export default SessionCard