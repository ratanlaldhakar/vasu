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

interface InvoiceNoticeEmailProps {
  clientName?: string;
  clientEmail?: string;
  planName?: string;
  itemDescription?: string;
  amountText?: string;
  paymentStatus?: string;
  invoiceNumber?: string;
  date?: string;
  paymentId?: string;
  actionUrl?: string;
}

export default function InvoiceNoticeEmail({
  clientName = "Valued Client",
  clientEmail = "client@example.com",
  planName = "Custom Website Service",
  itemDescription,
  amountText = "₹5,999",
  paymentStatus = "Pending",
  invoiceNumber = "INV-1001",
  date = new Date().toLocaleDateString("en-IN"),
  paymentId,
  actionUrl = "https://vasuu.bond/dashboard/bookings"
}: InvoiceNoticeEmailProps) {
  const isPending = paymentStatus?.toLowerCase() === "pending";

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
          `}
        </style>
      </Head>
      <Preview>
        {isPending 
          ? `💳 Payment Notice: ${amountText} due for ${planName}` 
          : `✓ Payment Confirmation & Receipt: ${amountText} for ${planName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Studio Brand Header */}
          <Section style={logoSection}>
            <div style={logoBox}>
              VASUU DESIGN STUDIO
            </div>
            <Hr style={gradientDivider} />
            <span style={isPending ? pendingBadge : paidBadge}>
              {isPending ? "⚠️ Payment Required" : "✓ Payment Confirmed"}
            </span>
          </Section>

          {/* Greeting Section */}
          <Section style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Heading style={heroTitle}>
              {isPending ? `Hello ${clientName}, new invoice issued 👋` : `Thank you for your payment, ${clientName} 👋`}
            </Heading>
            <Text style={heroSubtitle}>
              {isPending
                ? `An invoice of ${amountText} has been generated for your ${planName}. Please review the invoice details below and complete payment via your client portal.`
                : `We have received your payment of ${amountText} for ${planName}. Your official payment receipt has been issued.`}
            </Text>
          </Section>

          {/* Main Status Notice Banner Card */}
          <Section style={isPending ? pendingCard : paidCard}>
            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
              <tr>
                <td width="36" valign="top">
                  <div style={isPending ? pendingIcon : paidIcon}>
                    {isPending ? "💳" : "✓"}
                  </div>
                </td>
                <td valign="top" style={{ paddingLeft: '12px' }}>
                  <h3 style={isPending ? pendingTitle : paidTitle}>
                    {isPending ? `Invoice Amount: ${amountText}` : `Total Paid: ${amountText}`}
                  </h3>
                  <p style={statusDesc}>
                    {isPending 
                      ? "Status: Pending Payment (Click below to pay online securely via Razorpay)"
                      : `Status: Paid & Verified ${paymentId ? `(Ref: ${paymentId})` : ""}`}
                  </p>
                </td>
              </tr>
            </table>
          </Section>

          {/* Invoice Particulars Card */}
          <Section style={card}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#FFFFFF' }}>
              Invoice Particulars
            </Heading>
            
            <table border={0} cellPadding={0} cellSpacing={0} width="100%" style={gridContainer}>
              <tr>
                <td width="50%" style={{ paddingBottom: '16px' }}>
                  <div style={label}>Invoice Number</div>
                  <div style={{ ...valueText, color: '#38BDF8', fontFamily: 'monospace' }}>{invoiceNumber}</div>
                </td>
                <td width="50%" style={{ paddingBottom: '16px' }}>
                  <div style={label}>Date Issued</div>
                  <div style={valueText}>{date}</div>
                </td>
              </tr>
              
              <tr>
                <td colSpan={2} style={{ paddingBottom: '16px' }}>
                  <div style={label}>Service & Package</div>
                  <div style={{ ...valueText, fontSize: '17px', color: '#FFFFFF' }}>{planName}</div>
                  {itemDescription && (
                    <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                      {itemDescription}
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td width="50%">
                  <div style={label}>Billed To</div>
                  <div style={valueText}>{clientName}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{clientEmail}</div>
                </td>
                <td width="50%">
                  <div style={label}>Total Amount</div>
                  <div style={{ ...valueText, fontSize: '20px', color: isPending ? '#F59E0B' : '#10B981', fontWeight: '800' }}>
                    {amountText}
                  </div>
                </td>
              </tr>

              {paymentId && (
                <tr>
                  <td colSpan={2} style={{ paddingTop: '16px' }}>
                    <div style={label}>Transaction Ref ID</div>
                    <div style={{ ...valueText, fontFamily: 'monospace', color: '#10B981' }}>{paymentId}</div>
                  </td>
                </tr>
              )}
            </table>
          </Section>

          {/* Call to Action Button */}
          <Section style={ctaContainer}>
            <Heading as="h4" style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 16px 0', color: '#94A3B8' }}>
              {isPending ? "Ready to complete your payment?" : "Access your invoice & deliverables in Client Portal:"}
            </Heading>
            <table align="center" border={0} cellPadding={0} cellSpacing={0}>
              <tr>
                <td>
                  <Button href={actionUrl} style={isPending ? primaryPayButton : secondaryPortalButton}>
                    {isPending ? `💳 Pay ${amountText} Online Now` : "📄 View Invoice in Client Portal"}
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: '600', margin: '0 0 6px 0' }}>
              Vasuu Design Studio
            </Text>
            <Text style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0' }}>
              Bhilwara, Rajasthan, India • Support: hello@vasuu.bond
            </Text>
            
            <Text style={{ fontSize: '11px', color: '#64748B', margin: '0' }}>
              This is an automated notification sent to {clientEmail} regarding your Vasuu Design Studio account.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// Inline Styles
const main = {
  backgroundColor: '#0F172A',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: '#FFFFFF',
  margin: '0',
  padding: '0',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '36px 20px',
  backgroundColor: '#0F172A',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const logoBox = {
  display: 'inline-block',
  backgroundColor: '#1E293B',
  border: '1px solid #334155',
  borderRadius: '12px',
  padding: '10px 20px',
  fontSize: '18px',
  fontWeight: '800',
  color: '#FFFFFF',
  letterSpacing: '1px',
};

const gradientDivider = {
  height: '3px',
  background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
  borderRadius: '2px',
  margin: '20px 0',
  border: 'none',
};

const pendingBadge = {
  display: 'inline-block',
  backgroundColor: 'rgba(245, 158, 11, 0.15)',
  border: '1px solid #F59E0B',
  color: '#F59E0B',
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.2px',
  padding: '5px 12px',
  borderRadius: '100px',
};

const paidBadge = {
  display: 'inline-block',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  border: '1px solid #10B981',
  color: '#10B981',
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.2px',
  padding: '5px 12px',
  borderRadius: '100px',
};

const heroTitle = {
  fontSize: '26px',
  fontWeight: '800',
  lineHeight: '1.3',
  color: '#FFFFFF',
  letterSpacing: '-0.5px',
  margin: '0 0 10px 0',
};

const heroSubtitle = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#94A3B8',
  margin: '0 0 20px 0',
};

const card = {
  backgroundColor: '#1E293B',
  border: '1px solid #334155',
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '20px',
};

const pendingCard = {
  backgroundColor: 'rgba(245, 158, 11, 0.08)',
  border: '1.5px solid #F59E0B',
  borderRadius: '16px',
  padding: '20px 24px',
  marginBottom: '20px',
};

const paidCard = {
  backgroundColor: 'rgba(16, 185, 129, 0.08)',
  border: '1.5px solid #10B981',
  borderRadius: '16px',
  padding: '20px 24px',
  marginBottom: '20px',
};

const pendingIcon = {
  fontSize: '18px',
  lineHeight: '24px',
};

const paidIcon = {
  fontSize: '18px',
  lineHeight: '24px',
  color: '#10B981',
  fontWeight: 'bold' as const,
};

const pendingTitle = {
  fontSize: '17px',
  fontWeight: '700',
  color: '#F59E0B',
  margin: '0',
};

const paidTitle = {
  fontSize: '17px',
  fontWeight: '700',
  color: '#10B981',
  margin: '0',
};

const statusDesc = {
  fontSize: '13px',
  color: '#CBD5E1',
  margin: '4px 0 0 0',
};

const gridContainer = {
  width: '100%',
};

const label = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: '#94A3B8',
  marginBottom: '4px',
  fontWeight: '600',
};

const valueText = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#FFFFFF',
  margin: '0',
};

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '28px 0',
};

const primaryPayButton = {
  display: 'inline-block',
  backgroundColor: '#2563EB',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '700',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '12px',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
};

const secondaryPortalButton = {
  display: 'inline-block',
  backgroundColor: '#059669',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '700',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '12px',
  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
};

const footer = {
  textAlign: 'center' as const,
  paddingTop: '28px',
  borderTop: '1px solid #334155',
};
