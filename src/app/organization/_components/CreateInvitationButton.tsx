"use client"

import z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const createInvitationSchema = z.object({
    email: z.email().min(1).trim(),
    role: z.enum(["member", "admin"])
})

type CreateInvitationForm = z.infer<typeof createInvitationSchema>

const CreateInvitationButton = () => {
 
    const [open, setOpen] = useState<boolean>(false);
  
    const form = useForm<CreateInvitationForm>({
        resolver: zodResolver(createInvitationSchema),
        defaultValues: {
            email: "",
            role: "member"
        },
    })

    const {isSubmitting} = form.formState;

    async function handleCreateInvitaion(data: CreateInvitationForm) {
        await authClient.organization.inviteMember(data, {
            onError: error => {
                toast.error(error.error.message || "Failed to invite user")
            },
            onSuccess: () => {
                toast.success("Invitation sent successfully")
                form.reset();
                setOpen(false)
            }
        })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a user to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleCreateInvitaion)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} 
                />
                <FormField 
                    control={form.control}
                    name="role"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <LoadingSwap isLoading={isSubmitting}>
                            Invite
                        </LoadingSwap>    
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInvitationButton