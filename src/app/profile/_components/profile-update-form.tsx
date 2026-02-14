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
import { NumberInput } from "@/components/ui/number-input";
import { useRouter } from "next/navigation";


const updateProfileSchema = z.object({
    name: z.string().min(4),
    email: z.email(),
    favoriteNumber: z.number().int(),
})

type UpdateProfileForm = z.infer<typeof updateProfileSchema>

const ProfileUpdateForm = ({ user }:{
    user: { id: string, name: string, email: string, favoriteNumber?: number}
}) => {

    const router = useRouter();
  
    const form = useForm<UpdateProfileForm>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: user
    })

    const {isSubmitting} = form.formState;

    async function handleUpdateProfile(data: UpdateProfileForm) {
        const promises = [ 
            authClient.updateUser({
                name: data.name,
                favoriteNumber: data.favoriteNumber
            })
        ]

        if( data.email !== user.email){
            promises.push(
                authClient.changeEmail({
                    newEmail: data.email,
                    callbackURL: "/profile"
                })
            )
        }

        const res = await Promise.all(promises)

        const updateUserResult = res[0];
        const updateEmailResult = res[1];

        if(updateUserResult?.error) {
            toast.error(updateUserResult.error.message || "Failed to update profile")
        } else if ( updateEmailResult?.error ) {
            toast.error(updateEmailResult.error.message || "Failed to Update Email address")
        } else {
            if (data.email !== user.email) {
                toast.success("Verify your new email address to complete the change")
            } else {
                toast.success("Profile update successfully")
            }
            router.refresh();
        }
    }

    

  return (
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdateProfile)}>
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
                name="favoriteNumber"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Favorite Number</FormLabel>
                        <FormControl>
                            <NumberInput {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} 
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>
                    Update Profile
                </LoadingSwap>    
            </Button>
        </form>
    </Form>
  )
}

export default ProfileUpdateForm