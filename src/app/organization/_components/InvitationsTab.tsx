import { ActionButton } from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import CreateInvitationButton from "./CreateInvitationButton";



export default function InvitationsTab() {
    const { data: activeOrganization } = authClient.useActiveOrganization();
    const pendingInvites = activeOrganization?.invitations?.filter(
        invite => invite.status === "pending"
    )

    function cancelInvitation(invitationId: string) {
        return authClient.organization.cancelInvitation({ invitationId })
    }

    return (
        <div className="space-y-4">
            <div className="justify-end flex">
                <CreateInvitationButton />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        pendingInvites?.map( invitation => (
                            <TableRow key={invitation.id}>
                                <TableCell>{invitation.email}</TableCell>
                                <TableCell>
                                    <Badge variant={"outline"}>{invitation.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    { new Date(invitation.expiresAt).toLocaleDateString() }
                                </TableCell>
                                <TableCell>
                                    <ActionButton
                                        variant={"destructive"}
                                        size={"sm"}
                                        action={() => cancelInvitation(invitation.id)}>
                                        Cancel
                                    </ActionButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}