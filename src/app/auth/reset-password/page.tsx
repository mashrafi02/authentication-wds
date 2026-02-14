"use client"

import z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const resetPasswordSchema = z.object({
    password: z.string().min(8)
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const error = searchParams.get("error")
  
    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: ""
        },
    })

    const {isSubmitting} = form.formState;

    async function handleResetPassword(data: ResetPasswordForm) {
        if(token === null) return;

        await authClient.resetPassword(
            {newPassword: data.password,
            token
            },
            {
                onError: error => {
                    toast.error(error.error?.message || 'Failed to Reset password')
                },
                onSuccess: () => {
                    toast.success('password reset successfully', {description:"redirecting to login"});
                    setTimeout(() => {
                        router.push("/auth/login")
                    }, 1000)
                }
            }
        )
    }

    if(token == null || error != null){
        return (
            <div className="max-w-md mx-auto my-6">
                <Card className="w-md mx-auto mt-12">
                    <CardHeader className="text-2xl font-bold">
                        <CardTitle>Invalid Reset Link</CardTitle>
                        <CardDescription >
                            The password reset link is invalid or has expired
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link href="/auth/login">
                                Back to Login
                            </Link>
                        </Button>
                    </CardContent>
                </Card>    
            </div>
        )
    }

  return (
    <div className="max-w-md mx-auto my-6">
        <Card className="w-md mx-auto mt-12">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Reset your password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(handleResetPassword)}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} 
                        />

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            <LoadingSwap isLoading={isSubmitting}>
                                Reset Password
                            </LoadingSwap>    
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>    
    </div>
  )
}

export default ResetPassword