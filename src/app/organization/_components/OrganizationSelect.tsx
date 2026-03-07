"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner";


const OrganizationSelect = () => {

  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if( organizations == null || organizations.length === 0 ) return null;

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to switch organization")
        }
      }
    )
  }

  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an Organization"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Organizations</SelectLabel>
                {
                  organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))
                }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default OrganizationSelect