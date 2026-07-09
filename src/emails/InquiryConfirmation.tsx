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
  Hr,
  Row,
  Column
} from '@react-email/components';

interface InquiryConfirmationProps {
  name?: string;
  email?: string;
  phone?: string;
  packageName?: string;
  price?: string;
  date?: string;
  website?: string;
}

export default function InquiryConfirmation({
  name = "{{name}}",
  email = "{{email}}",
  phone = "{{phone}}",
  packageName = "{{package}}",
  price = "{{price}}",
  date = "{{date}}",
  website = "{{website}}"
}: InquiryConfirmationProps) {
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
      <Preview>Project inquiry received successfully!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={logoSection}>
            <div style={logoBox}>
              VASU
            </div>
            <Hr style={gradientDivider} />
            <span style={badge}>Project Inquiry Received</span>
          </Section>

          {/* Hero Section */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Heading style={heroTitle}>Thank you, {name} 👋</Heading>
            <Text style={heroSubtitle}>
              We&apos;ve successfully received your project inquiry. Our team is already reviewing your request.
            </Text>
          </Section>

          {/* Success Status Card */}
          <Section style={card}>
            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
              <tr>
                <td width="36" valign="top">
                  <div style={successIcon}>✓</div>
                </td>
                <td valign="top" style={{ paddingLeft: '12px' }}>
                  <h3 style={successTitle}>Inquiry Received Successfully</h3>
                  <p style={successDesc}>Everything has been submitted correctly.</p>
                </td>
              </tr>
            </table>
          </Section>

          {/* Project Summary Card */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#FFFFFF' }}>
              Project Summary
            </Heading>
            <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={gridContainer}>
              <tr>
                <td width="50%" style={{ paddingBottom: '16px' }}>
                  <div style={label}>Package</div>
                  <div style={{ ...valueText, color: '#6C63FF' }}>{packageName}</div>
                </td>
                <td width="50%" style={{ paddingBottom: '16px' }}>
                  <div style={label}>Estimated Price</div>
                  <div style={{ ...valueText, fontSize: '18px', color: '#22C55E' }}>{price}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div style={label}>Submitted On</div>
                  <div style={valueText}>{date}</div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Client Details Card */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#FFFFFF' }}>
              Your Details
            </Heading>
            <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={gridContainer}>
              <tr>
                <td style={{ paddingBottom: '16px' }}>
                  <div style={label}>👤 Full Name</div>
                  <div style={valueText}>{name}</div>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '16px' }}>
                  <div style={label}>📧 Email Address</div>
                  <div style={valueText}>
                    <Link href={`mailto:${email}`} style={{ color: '#6C63FF', textDecoration: 'none' }}>
                      {email}
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={label}>📞 Phone Number</div>
                  <div style={valueText}>{phone}</div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Project Timeline Tracker */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#FFFFFF' }}>
              Inquiry Tracker
            </Heading>
            
            <div style={timelineStep}>
              <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                <tr>
                  <td>
                    <h4 style={timelineText}>Step 1: Reviewing your inquiry</h4>
                    <p style={timelineSubtext}>We are analyzing your project specifications.</p>
                  </td>
                  <td align="right" width="100">
                    <span style={{ ...timelineStatus, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
                      Completed
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style={timelineStep}>
              <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                <tr>
                  <td>
                    <h4 style={timelineText}>Step 2: Preparing quotation</h4>
                    <p style={timelineSubtext}>Drafting estimate details and delivery schedules.</p>
                  </td>
                  <td align="right" width="100">
                    <span style={{ ...timelineStatus, backgroundColor: 'rgba(108, 99, 255, 0.15)', color: '#6C63FF' }}>
                      In Progress
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style={timelineStep}>
              <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                <tr>
                  <td>
                    <h4 style={{ ...timelineText, color: '#A0A6B1' }}>Step 3: Personal discussion</h4>
                    <p style={timelineSubtext}>Scheduling a quick call to refine details.</p>
                  </td>
                  <td align="right" width="100">
                    <span style={{ ...timelineStatus, backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#A0A6B1' }}>
                      Upcoming
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ ...timelineStep, borderBottom: 'none' }}>
              <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                <tr>
                  <td>
                    <h4 style={{ ...timelineText, color: '#A0A6B1' }}>Step 4: Project starts</h4>
                    <p style={timelineSubtext}>Initiating designs and development milestones.</p>
                  </td>
                </tr>
              </table>
            </div>
          </Section>

          {/* Next Steps Checklist */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', color: '#FFFFFF' }}>
              What happens next?
            </Heading>
            <div style={checklistItem}>✔ Our team will review your inquiry.</div>
            <div style={checklistItem}>✔ We usually respond within 24 hours.</div>
            <div style={checklistItem}>✔ You&apos;ll receive a detailed quotation.</div>
            <div style={checklistItem}>✔ We&apos;ll discuss your project requirements.</div>
            <div style={checklistItem}>✔ Once approved, development starts.</div>
          </Section>

          {/* CTA Buttons */}
          <Section style={ctaContainer}>
            <Heading as="h4" style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#FFFFFF' }}>
              Need immediate assistance?
            </Heading>
            <table align="center" border={0} cellPadding={0} cellSpacing={0}>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <Button href={`mailto:vasu@amrityogacenter.in`} style={primaryButton}>
                    Reply to this Email
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <Button href={website} style={secondaryButton}>
                    Visit Website
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button href={`${website}#contact`} style={secondaryButton}>
                    Book a Call
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: '500', margin: '0 0 8px 0' }}>
              Thank you for choosing us.
            </Text>
            <Text style={{ fontSize: '12px', color: '#A0A6B1', margin: '0 0 20px 0' }}>
              We&apos;re excited to build something amazing with you.
            </Text>
            
            <table align="center" border={0} cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
              <tr>
                <td style={{ padding: '0 8px' }}>
                  <Link href={website} style={{ color: '#6C63FF', fontSize: '12px', textDecoration: 'none' }}>
                    Website
                  </Link>
                </td>
                <td style={{ color: 'rgba(255, 255, 255, 0.2)' }}>&bull;</td>
                <td style={{ padding: '0 8px' }}>
                  <Link href="#" style={{ color: '#6C63FF', fontSize: '12px', textDecoration: 'none' }}>
                    Instagram
                  </Link>
                </td>
                <td style={{ color: 'rgba(255, 255, 255, 0.2)' }}>&bull;</td>
                <td style={{ padding: '0 8px' }}>
                  <Link href="#" style={{ color: '#6C63FF', fontSize: '12px', textDecoration: 'none' }}>
                    LinkedIn
                  </Link>
                </td>
              </tr>
            </table>

            <Text style={{ fontSize: '11px', color: '#A0A6B1', margin: '0' }}>
              Designed with ❤️ by Vasu &bull; &copy; {new Date().getFullYear()} All Rights Reserved
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
  background: 'linear-gradient(90deg, #6C63FF 0%, #22C55E 50%, #6C63FF 100%)',
  borderRadius: '2px',
  margin: '24px 0',
  border: 'none',
};

const badge = {
  display: 'inline-block',
  backgroundColor: 'rgba(108, 99, 255, 0.1)',
  border: '1px solid rgba(108, 99, 255, 0.2)',
  color: '#6C63FF',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  padding: '6px 12px',
  borderRadius: '100px',
  marginBottom: '16px',
};

const heroTitle = {
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.25',
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

const successIcon = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  border: '1.5px solid #22C55E',
  borderRadius: '50%',
  textAlign: 'center' as const,
  lineHeight: '22px',
  color: '#22C55E',
  fontWeight: 'bold' as const,
  fontSize: '14px',
};

const successTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#22C55E',
  margin: '0',
};

const successDesc = {
  fontSize: '14px',
  color: '#A0A6B1',
  margin: '4px 0 0 0',
};

const gridContainer = {
  width: '100%',
  marginBottom: '16px',
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

const timelineStep = {
  padding: '16px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
};

const timelineText = {
  fontSize: '14px',
  color: '#FFFFFF',
  fontWeight: '500',
  margin: '0',
};

const timelineSubtext = {
  fontSize: '12px',
  color: '#A0A6B1',
  margin: '2px 0 0 0',
};

const timelineStatus = {
  fontSize: '12px',
  fontWeight: 'bold' as const,
  padding: '2px 8px',
  borderRadius: '4px',
};

const checklistItem = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#A0A6B1',
  margin: '8px 0',
};

const ctaContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const primaryButton = {
  display: 'inline-block',
  width: '100%',
  maxWidth: '220px',
  backgroundColor: '#6C63FF',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '14px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
};

const secondaryButton = {
  display: 'inline-block',
  width: '100%',
  maxWidth: '220px',
  backgroundColor: 'transparent',
  border: '1.5px solid rgba(255, 255, 255, 0.1)',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '12px',
};

const footer = {
  textAlign: 'center' as const,
  paddingTop: '40px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
};
