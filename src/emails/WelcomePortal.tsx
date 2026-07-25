import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr
} from '@react-email/components';

interface WelcomePortalProps {
  name?: string;
  email?: string;
  tempPassword?: string;
  packageName?: string;
  price?: string;
  website?: string;
}

export default function WelcomePortal({
  name = "{{name}}",
  email = "{{email}}",
  tempPassword = "{{tempPassword}}",
  packageName = "{{package}}",
  price = "{{price}}",
  website = "https://vasu.design"
}: WelcomePortalProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
          `}
        </style>
      </Head>
      <Preview>Welcome to Vasu Client Portal - Your Account Details Inside! 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={logoSection}>
            <div style={logoBox}>
              VASU
            </div>
            <Hr style={gradientDivider} />
            <span style={badge}>Account Created Successfully</span>
          </Section>

          {/* Hero Section */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Heading style={heroTitle}>Welcome to the Portal, {name}! 🎉</Heading>
            <Text style={heroSubtitle}>
              Your booking for the <strong>{packageName}</strong> package ({price}) has been confirmed, and your private client account is ready.
            </Text>
          </Section>

          {/* Credentials Card */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', color: '#FFFFFF' }}>
              🔑 Your Login Credentials
            </Heading>
            <Text style={credentialDesc}>
              Use these details to access your portal, check project progress, and download files.
            </Text>
            
            <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={gridContainer}>
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <div style={label}>📧 Login Email Address</div>
                  <div style={valueText}>{email}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '16px' }}>
                  <div style={label}>🔒 Temporary Password</div>
                  <div style={{ ...valueText, fontFamily: 'monospace', fontSize: '16px', color: '#FF4D4D', letterSpacing: '1px' }}>
                    {tempPassword}
                  </div>
                </td>
              </tr>
            </table>

            <Text style={warningText}>
              ⚠️ <strong>Important:</strong> Please change your temporary password immediately after logging in for the first time.
            </Text>
          </Section>

          {/* Next Steps Checklist */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', color: '#FFFFFF' }}>
              💡 What can you do in the portal?
            </Heading>
            <div style={checklistItem}>✓ <strong>Track Live Progress:</strong> See what phase your site is in (Planning, Design, etc.).</div>
            <div style={checklistItem}>✓ <strong>Messages:</strong> Send notes and share project specifications with me.</div>
            <div style={checklistItem}>✓ <strong>File Cabinet:</strong> Download invoices, design contracts, and source code.</div>
            <div style={checklistItem}>✓ <strong>Booking History:</strong> View transaction receipts and order logs.</div>
          </Section>

          {/* CTA Buttons */}
          <Section style={ctaContainer}>
            <table align="center" border={0} cellPadding={0} cellSpacing={0}>
              <tr>
                <td style={{ paddingBottom: '16px' }}>
                  <Button href={`${website}/login`} style={primaryButton}>
                    Log In to Client Portal
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: '500', margin: '0 0 8px 0' }}>
              Thank you for your order!
            </Text>
            <Text style={{ fontSize: '12px', color: '#A0A6B1', margin: '0 0 20px 0' }}>
              I am excited to build something incredible with you.
            </Text>
            
            <table align="center" border={0} cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
              <tr>
                <td style={{ padding: '0 8px' }}>
                  <Link href={website} style={{ color: '#FF4D4D', fontSize: '12px', textDecoration: 'none' }}>
                    Website
                  </Link>
                </td>
                <td style={{ color: 'rgba(255, 255, 255, 0.2)' }}>&bull;</td>
                <td style={{ padding: '0 8px' }}>
                  <Link href={`${website}#portfolio`} style={{ color: '#FF4D4D', fontSize: '12px', textDecoration: 'none' }}>
                    Portfolio
                  </Link>
                </td>
              </tr>
            </table>

            <Text style={{ fontSize: '11px', color: '#A0A6B1', margin: '0' }}>
              Designed by Vasu &bull; &copy; {new Date().getFullYear()} All Rights Reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styling definitions
const main = {
  backgroundColor: '#07090D',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: '#FFFFFF',
  margin: '0',
  padding: '0',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
  backgroundColor: '#07090D',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const logoBox = {
  display: 'inline-block',
  backgroundColor: '#111418',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '10px 18px',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  letterSpacing: '1px',
};

const gradientDivider = {
  height: '4px',
  background: 'linear-gradient(90deg, #FF4D4D 0%, #2d5da1 50%, #FF4D4D 100%)',
  borderRadius: '2px',
  margin: '24px 0',
  border: 'none',
};

const badge = {
  display: 'inline-block',
  backgroundColor: 'rgba(255, 77, 77, 0.1)',
  border: '1px solid rgba(255, 77, 77, 0.2)',
  color: '#FF4D4D',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  padding: '6px 12px',
  borderRadius: '100px',
  marginBottom: '16px',
};

const heroTitle = {
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  color: '#FFFFFF',
  letterSpacing: '-0.5px',
  margin: '0 0 12px 0',
};

const heroSubtitle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#A0A6B1',
  margin: '0 0 24px 0',
};

const card = {
  backgroundColor: '#111418',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: '32px',
  marginBottom: '24px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
};

const credentialDesc = {
  fontSize: '14px',
  color: '#A0A6B1',
  margin: '0 0 20px 0',
  lineHeight: '1.5',
};

const warningText = {
  fontSize: '13px',
  color: '#FFB84D',
  backgroundColor: 'rgba(255, 184, 77, 0.1)',
  border: '1px solid rgba(255, 184, 77, 0.2)',
  borderRadius: '8px',
  padding: '12px',
  margin: '16px 0 0 0',
  lineHeight: '1.5',
};

const gridContainer = {
  width: '100%',
  marginBottom: '8px',
};

const label = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.1px',
  color: '#A0A6B1',
  marginBottom: '4px',
};

const valueText = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#FFFFFF',
  margin: '0',
};

const checklistItem = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#A0A6B1',
  margin: '10px 0',
};

const ctaContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '32px',
};

const primaryButton = {
  display: 'inline-block',
  width: '100%',
  backgroundColor: '#FF4D4D',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '14px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(255, 77, 77, 0.4)',
};

const footer = {
  textAlign: 'center' as const,
  paddingTop: '40px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
};
