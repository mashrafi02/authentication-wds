import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import SessionManagement from "./sessions-tab-components/SessionManagement";

export default async function SessionsTab({ currentSession }: { currentSession: string}) {
    const sessions = await auth.api.listSessions({ headers: await headers() });

    return (
        <Card>
            <CardContent>
                <SessionManagement 
                    sessions={sessions}
                    currentSessionToken={currentSession}/>
            </CardContent>
        </Card>
    )
}