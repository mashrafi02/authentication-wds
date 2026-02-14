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


const forgotPasswordSchema = z.object({
    email: z.email(),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = ({openSignInTab}:{openSignInTab: () => void}) => {
  
    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const {isSubmitting} = form.formState;

    async function handleSendResetPasswordEmail(data: ForgotPasswordForm) {
        await authClient.requestPasswordReset(
            {...data, redirectTo: '/auth/reset-password'},
            {
                onError: error => {
                    toast.error(error.error?.message || 'Failed to send password reset email')
                },
                onSuccess: () => {
                    toast.success('email sent successfully');
                }
            }
        )
    }

    

  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSendResetPasswordEmail)}>
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
            <div className="flex gap-2">
                <Button type="button" variant={"outline"} onClick={openSignInTab}>
                    Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <LoadingSwap isLoading={isSubmitting}>
                        Send Reset Password Email
                    </LoadingSwap>    
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default ForgotPassword