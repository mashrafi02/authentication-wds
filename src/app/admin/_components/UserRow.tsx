"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { UserWithRole } from "better-auth/plugins";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function UserRow({
    user, selfId
} : {
    user: UserWithRole,
    selfId: string
}) {

    const isSelf = user.id == selfId;
    const router = useRouter();
    const { refetch } = authClient.useSession();

    function handleImpersonateUser(userId: string){
        authClient.admin.impersonateUser({userId}, {
            onError: err => {
                toast.error(err.error.message || "Failed to impersonate user")
            }, onSuccess: () => {
                refetch()
                router.push("/")
            }
        })
    }

    function handleBanUser(userId: string) {
        authClient.admin.banUser({userId}, {
            onError: err => {
                toast.error(err.error.message || "Failed to ban user")
            }, onSuccess: () => {
                toast.success("User bannned successfully");
                router.refresh()
            }
        })
    }

    function handleUnbanUser(userId: string) {
        authClient.admin.unbanUser({userId}, {
            onError: err => {
                toast.error(err.error.message || "Failed to unban user")
            }, onSuccess: () => {
                toast.success("User unbannned successfully");
                router.refresh()
            }
        })
    }

    function handleRevokeSessions(userId: string) {
        authClient.admin.revokeUserSessions({userId}, {
            onError: err => {
                toast.error(err.error.message || "Failed to revoke user sessions")
            }, onSuccess: () => {
                toast.success("User sessions revoked successfully");
            }
        })
    }

    function handleRemoveUser(userId: string) {
        authClient.admin.removeUser({userId}, {
            onError: err => {
                toast.error(err.error.message || "Failed to delete user")
            }, onSuccess: () => {
                toast.success("User deleted");
                router.refresh()
            }
        })
    }

    return (
        <TableRow key={user.id}>
            <TableCell>
                <div className="flex items-start gap-1 not-empty:mt-2">
                    <div className="w-[220px]">
                        <div className="font-medium">{ user.name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">
                            {user.email}
                        </div>
                    </div>
                    <div>
                        { user.banned && <Badge variant={"destructive"}>Banned</Badge>}
                        { !user.emailVerified && <Badge variant={"outline"}>Unverified</Badge>}
                        { isSelf && <Badge>You</Badge>}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                </Badge>
            </TableCell>
            <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
                {!isSelf && (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"icon"}>
                                    <MoreHorizontal/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleImpersonateUser(user.id)}>
                                    Impersonate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                                    Revoke Sessions
                                </DropdownMenuItem>
                                {
                                    user.banned ? (
                                        <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                                            Unban User
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                                            Ban User
                                        </DropdownMenuItem>
                                    )
                                }
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger>
                                    <DropdownMenuItem variant="destructive">
                                        Delete User
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete User
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="bg-destructive! text-destructive-foreground! hover:bg-destructive/90!"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </TableCell>
        </TableRow>
    )
}