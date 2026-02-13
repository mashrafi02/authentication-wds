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
  
  export default function ResetPasswordEmail({
    user,
    url,
  }: {
    user: { email: string; name: string };
    url: string;
  }) {
    return (
      <Html>
        <Head>
          <title>Reset Your Password</title>
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
        <Preview>Reset your password securely</Preview>
  
        <Section
          style={{
            padding: "24px",
            fontFamily: "Roboto, Verdana, sans-serif",
            backgroundColor: "#ffffff",
          }}
        >
          <Row>
            <Heading as="h2">Hi {user.name},</Heading>
          </Row>
  
          <Row>
            <Text>
              We received a request to reset your password. Click the button
              below to choose a new password.
            </Text>
          </Row>
  
          <Row style={{ margin: "24px 0" }}>
            <Button
              href={url}
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Reset Password
            </Button>
          </Row>
  
          <Row>
            <Text style={{ fontSize: "14px", color: "#555" }}>
              This link will expire in 15 minutes for security reasons.
            </Text>
          </Row>
  
          <Row>
            <Text style={{ fontSize: "14px", color: "#555" }}>
              If you didn’t request a password reset, you can safely ignore this
              email. Your account remains secure.
            </Text>
          </Row>
  
          {/* <Row>
            <Text
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "20px",
                wordBreak: "break-all",
              }}
            >
              If the button doesn’t work, copy and paste this link into your
              browser:
              <br />
              {url}
            </Text>
          </Row> */}
        </Section>
      </Html>
    );
  }
  