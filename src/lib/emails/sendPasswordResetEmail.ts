import { resend } from "@/lib/resend";
import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";


export async function sendPasswordResetEmail(
    user: { email: string; name: string },
    url: string
): Promise<unknown>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Mystery message Reset Password',
            react: ResetPasswordEmail({user, url}),
            });
        return {
            success: true,
            message: 'email sent successfully'
        }
    } catch (emailError) {
        console.error("email send error", emailError);
        return {
            success: false,
            message: 'Failed to send email'
        }
    }
}