import { resend } from "@/lib/resend";
import DeleteAccountVerificationEmail from "@/components/emails/DeleteAccountVerificationEmail";


export async function sendDelteAccountVerificationEmail(
    user: { email: string; name: string },
    url: string
): Promise<unknown>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Better Auth WDS Delete account Verification code',
            react: DeleteAccountVerificationEmail({user, url}),
            });
        return {
            success: true,
            message: 'delete account verification email sent successfully'
        }
    } catch (emailError) {
        console.error("email send error", emailError);
        throw emailError
    }
}