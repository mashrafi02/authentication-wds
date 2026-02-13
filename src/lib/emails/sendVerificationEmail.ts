import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/emails/VerificationEmail"


export async function sendVerificationEmail(
    user: { email: string; name: string },
    url: string
): Promise<unknown>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Better Auth WDS Verification code',
            react: VerificationEmail({user, url}),
            });
        return {
            success: true,
            message: 'verification email sent successfully'
        }
    } catch (emailError) {
        console.error("email send error", emailError);
        throw emailError
    }
}