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
import { useRouter } from "next/navigation";
import { Passkey } from "@better-auth/passkey";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const passkeySchema = z.object({
    name: z.string().min(1)
})

type PasskeyForm = z.infer<typeof passkeySchema>

const PasskeyManagement = ({passkeys} : {passkeys: Passkey[]}) => {

    const router = useRouter();
    const [isDialogueOpen, setIsDialogueOpen] = useState(false)
  
    const form = useForm<PasskeyForm>({
        resolver: zodResolver(passkeySchema),
        defaultValues: {
            name: ""
        },
    })

    const {isSubmitting} = form.formState;

    async function handleAddPasskey(data: PasskeyForm) {
        await authClient.passkey.addPasskey(data, {
            onError: error => {
                toast.error(error.error.message || "failed to add passkey")
            },
            onSuccess: () => {
                router.refresh();
                setIsDialogueOpen(false)
            }
        })
    }

    async function handleDeletePasskey(passkeyId: string) {
        return await authClient.passkey.deletePasskey(
            {id : passkeyId},
            {onSuccess: () => router.refresh()}
        )
    }

  return (
    <div className="space-y-6">
        {passkeys.length === 0 ? (
            <Card>
                <CardHeader>
                    <CardTitle>
                        No passkeys yet
                    </CardTitle>
                    <CardDescription>
                        Add your first passkey for secure, passwordless authentication.
                    </CardDescription>
                </CardHeader>
            </Card>
        ) : (
            <div className="space-y-4">
                {passkeys.map(passkey => (
                    <Card key={passkey.id}>
                        <CardHeader className="flex gap-2 items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>
                                    {passkey.name}
                                </CardTitle>
                                <CardDescription>
                                    Created { new Date(passkey.createdAt).toLocaleDateString() }
                                </CardDescription>
                            </div>
                            <ActionButton
                                requireAreYouSure
                                variant={"destructive"}
                                size={"icon"}
                                action={() => handleDeletePasskey(passkey.id)}>
                                <Trash2 />
                            </ActionButton>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )}
        <Dialog open={isDialogueOpen} onOpenChange={open => {
            if(open) form.reset();
            setIsDialogueOpen(open)
        }}>
            <DialogTrigger asChild>
                <Button>New Passkey</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New Passkey</DialogTitle>
                <DialogDescription>
                    Create a new passkey for secure, passwordless authentication
                </DialogDescription>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(handleAddPasskey)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} 
                        />

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            <LoadingSwap isLoading={isSubmitting}>
                                Add Passkey
                            </LoadingSwap>    
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default PasskeyManagement