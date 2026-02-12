

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SignUpTab from "@/app/_components/sign-up-tab"
import SignInTab from "@/app/_components/sign-in-tab"
import { Separator } from "@/components/ui/separator"
import SocialAuthButtons from "@/app/_components/social-auth-buttons"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"


const Login = () => {

    const router = useRouter();
    useEffect( () => {
        authClient.getSession().then(session => {
            if(session.data !== null) router.push('/')
        })
    }, [router])

  return (
    <Tabs defaultValue="signin" className="max-auto w-full my-6 px-4">
        <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
            <Card className="w-md mx-auto mt-12">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignInTab />
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-2 gap-3">
                    <SocialAuthButtons />
                </CardFooter>
            
            </Card>
        </TabsContent>

        <TabsContent value="signup">
            <Card className="w-md mx-auto mt-12">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpTab />
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-2 gap-3">
                    <SocialAuthButtons />
                </CardFooter>
            </Card>
        </TabsContent>
    </Tabs>
  )
}

export default Login