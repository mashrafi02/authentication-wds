import { auth } from "@/lib/auth/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrganizationSelect from "./_components/OrganizationSelect";
import CreateOrganizationButton from "./_components/CreateOrganizationButton";
import OrganizationTabs from "./_components/OrganizationTabs";


export default async function Organization() {

    const session = await auth.api.getSession({ headers: await headers() });
    if( session == null ) return redirect("/auth/login");

    return (
        <div className="container mx-auto my-6 px-4">
            <Link href={"/"} className="inline-flex items-center mb-6">
                <ArrowLeft className="size-4 mr-2"/>
                Back to Home
            </Link>

            <div className="flex items-center mb-8 gap-2">
                <OrganizationSelect />
                <CreateOrganizationButton />
            </div>

            <OrganizationTabs />
        </div>
    )
}