import OrganizationInviteEmail from "@/components/emails/OrganizationInviteEmail";
import { resend } from "@/lib/resend";


export async function sendOrganizationInviteEmail({
    invitation,
    inviter,
    organization,
    email,
  }: {
    invitation: { id: string };
    inviter: { name: string };
    organization: { name: string };
    email: string;
  }): Promise<unknown>{
    
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Better Auth WDS Invitaion for Organization',
            react: OrganizationInviteEmail({invitation, inviter, organization, email}),
            });
        return {
            success: true,
            message: 'invitation email sent successfully'
        }
    } catch (emailError) {
        console.error("email send error", emailError);
        throw emailError
    }
}