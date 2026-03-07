import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvitationForm from "./_components/InvitationForm";


export default async function InvitaionPage({
    params,
}: PageProps<"/organization/invites/[id]">) {
    const session = await auth.api.getSession({ headers: await headers() });
    if(session == null) return redirect("/auth/login")

    const { id } = await params;

    const invitation = await auth.api.getInvitation({
        headers: await headers(),
        query: { id },
    })
    .catch( () => redirect("/") )

    return (
        <div className="container mx-auto my-6 max-w-2xl px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Organization Invitaion</CardTitle>
                    <CardDescription>
                        You have been invited to join the {invitation.organizationName}{" "}
                        organization as a {invitation.role}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <InvitationForm invitation={invitation} />
                </CardContent>
            </Card>
        </div>
    )
}