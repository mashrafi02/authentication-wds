import WelcomeEmail from "@/components/emails/WelcomeEamil";
import { resend } from "@/lib/resend";


export async function sendWelcomeEmail(
    user: { email: string; name: string },
): Promise<unknown>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Better Auth WDS Welcome with warmth',
            react: WelcomeEmail({user}),
            });
        return {
            success: true,
            message: 'email sent successfully'
        }
    } catch (emailError) {
        console.error("email send error", emailError);
        throw emailError
    }
}