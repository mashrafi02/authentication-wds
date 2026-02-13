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
  
  export default function VerificationEmail({
    user,
    url,
  }: {
    user: { email: string; name: string };
    url: string;
  }) {
    return (
      <Html>
        <Head>
          <title>Email Verification</title>
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
  
        {/* Preview text (appears in inbox preview) */}
        <Preview>Verify your email address</Preview>
  
        <Section style={{ padding: "20px", fontFamily: "Roboto, Verdana" }}>
          <Row>
            <Heading as="h2">Hello {user.name},</Heading>
          </Row>
  
          <Row>
            <Text>
              Thank you for registering. Please click the button below to verify
              your email address:
            </Text>
          </Row>
  
          <Row style={{ margin: "20px 0" }}>
            <Button
              href={url}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Verify Email
            </Button>
          </Row>
  
          <Row>
            <Text style={{ fontSize: "14px", color: "#555" }}>
              If you didn&apos;t request this, you can safely ignore this email.
            </Text>
          </Row>
  
          {/* <Row>
            <Text style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
              Or copy and paste this link into your browser:
              <br />
              {url}
            </Text>
          </Row> */}
        </Section>
      </Html>
    );
  }
  