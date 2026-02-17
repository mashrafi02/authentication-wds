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
  
  export default function DeleteAccountVerificationEmail({
    user,
    url,
  }: {
    user: { email: string; name: string };
    url: string;
  }) {
    return (
      <Html>
        <Head>
          <title>Confirm Account Deletion</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontStyle="normal"
            fontWeight={400}
          />
        </Head>
  
        {/* Inbox preview text */}
        <Preview>Confirm your account deletion request</Preview>
  
        <Section style={{ padding: "20px", fontFamily: "Roboto, Verdana" }}>
          <Row>
            <Heading as="h2">Hello {user.name},</Heading>
          </Row>
  
          <Row>
            <Text>
              We received a request to permanently delete your account associated
              with <strong>{user.email}</strong>.
            </Text>
          </Row>
  
          <Row>
            <Text>
              ⚠️ <strong>This action cannot be undone.</strong> All your data,
              settings, and history will be permanently removed.
            </Text>
          </Row>
  
          <Row style={{ margin: "24px 0" }}>
            <Button
              href={url}
              style={{
                backgroundColor: "#dc2626", // destructive red
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Confirm Account Deletion
            </Button>
          </Row>
  
          <Row>
            <Text style={{ fontSize: "14px", color: "#555" }}>
              If you did not request this deletion, please ignore this email.
              Your account will remain safe and unchanged.
            </Text>
          </Row>
  
          <Row>
            <Text style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
              For security reasons, this link may expire after a short period.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }
  