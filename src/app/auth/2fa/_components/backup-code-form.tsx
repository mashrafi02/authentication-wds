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

const backupCodeSchema = z.object({
    code: z.string().min(1)
})

type BackUpCodeForm = z.infer<typeof backupCodeSchema>

const BackupCodeTab = () => {

    const router = useRouter();
  
    const form = useForm<BackUpCodeForm>({
        resolver: zodResolver(backupCodeSchema),
        defaultValues: {
            code: ""
        },
    })

    const {isSubmitting} = form.formState;

    async function handleTwoFABackup(data: BackUpCodeForm) {
        await authClient.twoFactor.verifyBackupCode(
            data, {
                onError: error => {
                    toast.error(error.error.message || "Failed to verify code")
                },
                onSuccess: () => {
                    router.push("/")
                }
            }
        )
    }

  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleTwoFABackup)}>
            <FormField
                control={form.control}
                name="code"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Backup Code</FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} 
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>
                    Verify
                </LoadingSwap>    
            </Button>
        </form>
    </Form>
  )
}

export default BackupCodeTab