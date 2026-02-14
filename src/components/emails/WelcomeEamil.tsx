import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Hr,
} from "@react-email/components";

export default function WelcomeEmail({
  user,
}: {
  user: { email: string; name: string };
}) {
  return (
    <Html>
      <Head>
        <title>Welcome to Our Platform</title>
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

      <Preview>
        Welcome aboard! We&apos;re excited to have you with us.
      </Preview>

      <Section
        style={{
          padding: "40px 20px",
          fontFamily: "Roboto, Verdana, sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Row>
          <Heading as="h1" style={{ marginBottom: "10px" }}>
            Welcome, {user.name}! 🎉
          </Heading>
        </Row>

        <Row>
          <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
            We’re thrilled to have you join our community. Your account has been
            successfully created using <strong>{user.email}</strong>.
          </Text>
        </Row>

        <Row>
          <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
            Our platform is designed to make your experience smooth, productive,
            and enjoyable. You can now explore features, manage your dashboard,
            and start getting the most out of everything we offer.
          </Text>
        </Row>

        <Row>
          <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
            If you ever need help or have questions, our support team is always
            here for you.
          </Text>
        </Row>

        <Hr style={{ margin: "40px 0" }} />

        <Row>
          <Text style={{ fontSize: "14px", color: "#6b7280" }}>
            Thanks again for joining us — we’re excited to have you on board!
          </Text>
        </Row>

        <Row>
          <Text style={{ fontSize: "14px", color: "#9ca3af", marginTop: "20px" }}>
            — The Team
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
