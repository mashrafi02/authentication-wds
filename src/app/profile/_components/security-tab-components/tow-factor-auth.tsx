"use client"

import z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code"


const twoFactorAuthSchema = z.object({
    password: z.string().min(1),
})

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>
type TwoFactorData = {
    totpURI: string;
    backupCodes: string[];
}

const TwoFactorAuth = ({ isEnabled }:{
    isEnabled : boolean
}) => {

    const router = useRouter();
    const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
  
    const form = useForm<TwoFactorAuthForm>({
        resolver: zodResolver(twoFactorAuthSchema),
        defaultValues: {
            password : ""
        }
    })

    const {isSubmitting} = form.formState;

    async function handleEnable2fa(data: TwoFactorAuthForm) {
        const result = await authClient.twoFactor.enable({
            password: data.password
        })

        if ( result.error ) {
            toast.error( result.error.message || "failed to enabled 2FA" )
        } else {
            setTwoFactorData(result.data);
            form.reset()
        }
    }

    async function handleDisable2fa(data: TwoFactorAuthForm) {
        await authClient.twoFactor.disable(
            {
                password: data.password
            },
            {
                onError: err => {
                    toast.error( err.error.message || "Failed to disable 2FA" )
                },
                onSuccess: () => {
                    form.reset();
                    router.refresh()
                }
            }
        )
    }

    if ( twoFactorData !== null ) {
        return (
            <QRCodeVerify 
                {...twoFactorData}
                onDone = {() => {
                    setTwoFactorData(null)
                }}
            />
        )
    }

  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit( isEnabled ? handleDisable2fa : handleEnable2fa )}>
            <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <PasswordInput {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} 
            />
            <Button type="submit" disabled={isSubmitting} className="w-full" variant={isEnabled ? "destructive" : "outline"}>
                <LoadingSwap isLoading={isSubmitting}>
                    { isEnabled ? "Disable 2FA" : "Enable 2FA" }
                </LoadingSwap>    
            </Button>
        </form>
    </Form>
  )
}

export default TwoFactorAuth



const qrSchema = z.object({
    token: z.string().length(6),
})

type qrForm = z.infer<typeof qrSchema>;

function QRCodeVerify ({
    totpURI, backupCodes, onDone
} : TwoFactorData & { onDone: () => void }) {

    const router = useRouter();
    const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
    const form = useForm<qrForm>({
        resolver: zodResolver(qrSchema),
        defaultValues: {
            token : ""
        }
    })

    const {isSubmitting} = form.formState;

    async function handleQrCode(data: qrForm) {
        await authClient.twoFactor.verifyTotp(
            {
                code: data.token,
            },
            {
                onError: err => {
                    toast.error(err.error.message || "Failed to verify code" )
                },
                onSuccess: () => {
                    setSuccessfullyEnabled(true)
                    router.refresh()
                }
            }
        )
    }

    if ( successfullyEnabled ) {
        return (
            <>
                <p className="text-sm text-muted-foreground mb-2">
                    Save this backup codes in a safe place. You can use them to access your account
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {
                        backupCodes.map((code, index) => (
                            <div key={index} className="font-mono text-sm">
                                {code}
                            </div>
                        ))
                    }
                </div>
                <Button variant={"outline"} onClick={onDone}>
                    Done
                </Button>
            </>
        )
    }

  return (
    <div className="space-y-4">
        <p className="text-muted-foreground">
            Scan this QR code with your authenticator app and enter the code below:
        </p>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit( handleQrCode )}>
                <FormField
                    control={form.control}
                    name="token"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Token</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} 
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <LoadingSwap isLoading={isSubmitting}>
                        Submit Code
                    </LoadingSwap>    
                </Button>
            </form>
        </Form>
        <div className="p-4 bg-white w-fit">
            <QRCode size={256} value={totpURI} />
        </div>
    </div>
  )
}