import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from "@react-email/components";
  import { BETTER_AUTH_BASE_URL } from "../../../constants";
  
  export default function OrganizationInviteEmail({
    invitation,
    inviter,
    organization,
    email,
  }: {
    invitation: { id: string };
    inviter: { name: string };
    organization: { name: string };
    email: string;
  }) {
    const inviteUrl = `${BETTER_AUTH_BASE_URL}/organization/invites/${invitation.id}`;
  
    return (
      <Html>
        <Head>
          <title>You&apos;re invited to join {organization.name}</title>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
              format: "woff2",
            }}
          />
        </Head>
  
        <Preview>
          {inviter.name} invited you to join {organization.name}
        </Preview>
  
        <Section style={{ padding: "40px", backgroundColor: "#f6f9fc" }}>
          <Row>
            <Section
              style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                borderRadius: "8px",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              <Heading as="h2">
                You&apos;re invited to join {organization.name}
              </Heading>
  
              <Text>
                Hello {email},
              </Text>
  
              <Text>
                <strong>{inviter.name}</strong> has invited you to join the
                organization <strong>{organization.name}</strong>.
              </Text>
  
              <Text>
                Click the button below to accept the invitation and become a
                member of the organization.
              </Text>
  
              <Section style={{ marginTop: "24px", marginBottom: "24px" }}>
                <Button
                  href={inviteUrl}
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Accept Invitation
                </Button>
              </Section>
  
              <Text style={{ fontSize: "12px", color: "#666" }}>
                If the button doesn&apos;t work, copy and paste this link into your
                browser:
              </Text>
  
              <Text
                style={{
                  fontSize: "12px",
                  wordBreak: "break-all",
                  color: "#555",
                }}
              >
                {inviteUrl}
              </Text>
  
              <Text style={{ fontSize: "12px", color: "#999", marginTop: "24px" }}>
                If you were not expecting this invitation, you can safely ignore
                this email.
              </Text>
            </Section>
          </Row>
        </Section>
      </Html>
    );
  }