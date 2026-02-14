"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SignUpTab from "@/app/_components/sign-up-tab"
import SignInTab from "@/app/_components/sign-in-tab"
import { Separator } from "@/components/ui/separator"
import SocialAuthButtons from "@/app/_components/social-auth-buttons"
import EmailVerification from "@/app/_components/email-verification"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import ForgotPassword from "@/app/_components/forgot-password"

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

const Login = () => {

    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<Tab>("signin");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        authClient.getSession().then(session => {
            if (session.data !== null ) {
                setLoggedIn(true);
                return router.push('/')
            }
        })
    })

    function openEmailVerificationTab(email: string) {
        setEmail(email);
        setSelectedTab("email-verification")
    }

    function openSignInTab(){
        setSelectedTab("signin")
    }

    function openForgotPasswordTab () {
        setSelectedTab("forgot-password")
    }


  return !loggedIn && (
    <Tabs value={selectedTab} onValueChange={t => setSelectedTab(t as Tab)} className="max-auto w-full my-6 px-4">
        {
            (selectedTab === "signin" || selectedTab === "signup") && (
                <TabsList>
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
            )
        }
        
        <TabsContent value="signin">
            <Card className="w-md mx-auto mt-12">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignInTab openEmailVerificationTab={openEmailVerificationTab} openForgotPasswordTab={openForgotPasswordTab}/>
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
                    <SignUpTab openEmailVerificationTab={openEmailVerificationTab}/>
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-2 gap-3">
                    <SocialAuthButtons />
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="email-verification">
            <Card className="w-md mx-auto mt-12">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Verify your email</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmailVerification email={email} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="forgot-password">
            <Card className="w-md mx-auto mt-12">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <ForgotPassword openSignInTab={openSignInTab} />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  )
    
}

export default Login