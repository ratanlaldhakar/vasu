export function getEmailHtml({
  name,
  email,
  phone,
  packageName = "Standard Inquiry",
  price = "Contact",
  brand = "",
  projectType = "",
  timeline = "",
  budget = "",
  details = "",
  message = "",
  time = "",
  paymentId = "",
  orderId = ""
}: {
  name: string;
  email: string;
  phone: string;
  packageName?: string;
  price?: string;
  brand?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
  details?: string;
  message?: string;
  time?: string;
  paymentId?: string;
  orderId?: string;
}) {
  const displayDetails = details || message;
  const isCustom = packageName.toLowerCase() === "custom";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Project Inquiry</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; color: #ededed; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #0b0b0c; border: 1px solid #1f1f23; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    <!-- Gradient Header Bar -->
    <tr>
      <td height="6" style="background: linear-gradient(90deg, #ff4d4d 0%, #2d5da1 50%, #ff4d4d 100%);"></td>
    </tr>
    
    <!-- Logo & Header -->
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #16161a; border: 1.5px solid #2d2d34; border-radius: 12px; padding: 10px 14px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px; font-size: 18px;">
              VASU
            </td>
          </tr>
        </table>
        <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 24px 0 8px 0; letter-spacing: -0.5px;">New Project Inquiry</h1>
        <p style="font-size: 14px; color: #8e8e93; margin: 0;">Submitted on ${time || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      </td>
    </tr>

    <!-- Main Card Content -->
    <tr>
      <td style="padding: 0 40px 40px 40px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          
          <!-- Package & Price Info -->
          <tr>
            <td style="background-color: #121215; border: 1px solid #222227; border-radius: 16px; padding: 24px; margin-bottom: 24px; display: block;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #ff4d4d; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 8px; border-radius: 100px; margin-bottom: 8px;">
                      ${packageName}
                    </span>
                    <div style="font-size: 32px; font-weight: 700; color: #ffffff; margin-top: 4px;">
                      ${price}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Details Grid -->
          <tr>
            <td style="padding: 12px 0 24px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px; padding-bottom: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Client Name</div>
                    <div style="font-size: 15px; font-weight: 600; color: #ffffff;">${name}</div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 10px; padding-bottom: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Email Address</div>
                    <div style="font-size: 15px; font-weight: 600; color: #ffffff;"><a href="mailto:${email}" style="color: #2d5da1; text-decoration: none;">${email}</a></div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Phone Number</div>
                    <div style="font-size: 15px; font-weight: 600; color: #ffffff;"><a href="tel:${phone}" style="color: #ededed; text-decoration: none;">${phone}</a></div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 10px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Business / Brand</div>
                    <div style="font-size: 15px; font-weight: 600; color: #ffffff;">${brand || 'Not provided'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${paymentId ? `
          <!-- Payment Info Box -->
          <tr>
            <td style="background-color: #121215; border: 1px solid #1f1f23; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: block;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 8px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Payment ID</div>
                    <div style="font-size: 14px; font-weight: 600; color: #22c55e;">${paymentId}</div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 8px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Order ID</div>
                    <div style="font-size: 14px; font-weight: 600; color: #ffffff;">${orderId}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          ${isCustom ? `
          <!-- Custom Project Details Grid -->
          <tr>
            <td style="background-color: #121215; border: 1px solid #1f1f23; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: block;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 8px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Project Type</div>
                    <div style="font-size: 14px; font-weight: 600; color: #ffffff;">${projectType}</div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 8px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Timeline</div>
                    <div style="font-size: 14px; font-weight: 600; color: #ffffff;">${timeline}</div>
                  </td>
                </tr>
                ${budget ? `
                <tr>
                  <td colspan="2" style="padding-top: 12px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 4px;">Estimated Budget</div>
                    <div style="font-size: 14px; font-weight: 600; color: #ffffff;">${budget}</div>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Project Details Box -->
          <tr>
            <td style="padding-top: 12px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; margin-bottom: 8px;">Project Details</div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #121215; border-left: 4px solid #ff4d4d; border-top: 1px solid #1f1f23; border-right: 1px solid #1f1f23; border-bottom: 1px solid #1f1f23; border-radius: 0 12px 12px 0; padding: 20px; font-size: 14px; line-height: 1.6; color: #d1d1d6; font-style: italic;">
                    ${displayDetails ? displayDetails.replace(/\n/g, '<br />') : 'No details provided.'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Buttons CTA -->
          <tr>
            <td style="padding-top: 36px; text-align: center;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="mailto:${email}" style="display: block; width: 100%; max-width: 250px; background: linear-gradient(90deg, #ff4d4d 0%, #ff6666 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-align: center; text-decoration: none; padding: 14px 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);">
                      Reply to Client
                    </a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td align="center">
                    <a href="tel:${phone}" style="display: block; width: 100%; max-width: 250px; background-color: transparent; border: 1.5px solid #2d2d34; color: #ededed; font-size: 15px; font-weight: 600; text-align: center; text-decoration: none; padding: 12px 24px; border-radius: 12px;">
                      Call Client
                    </a>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td height="1" style="background-color: #1f1f23;"></td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 32px 40px; text-align: center; background-color: #080809;">
        <p style="font-size: 12px; color: #8e8e93; margin: 0 0 8px 0;">
          This inquiry was sent from your portfolio website contact form.
        </p>
        <p style="font-size: 12px; color: #ff4d4d; margin: 0;">
          <a href="https://vasu.design" style="color: #ff4d4d; text-decoration: none; font-weight: 500;">vasu.design</a> &bull; &copy; ${new Date().getFullYear()} Vasu
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
