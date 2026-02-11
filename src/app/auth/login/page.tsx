import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SignUpTab from "@/app/_components/sign-up-tab"
import SignInTab from "@/app/_components/sign-in-tab"


const Login = () => {
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
                </Card>
            </TabsContent>
    </Tabs>
  )
}

export default Login