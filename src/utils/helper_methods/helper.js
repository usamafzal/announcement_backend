const GenerateToken = () => {
  return (crypto.getRandomValues(new Uint32Array(1))[0] % 90000) + 10000;
};

const OtpEmailTemplate = (otp, username) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset OTP</title>

  <style>
    /* Mobile styles (supported by most clients) */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 20px !important;
      }
      .otp {
        font-size: 24px !important;
        letter-spacing: 4px !important;
        padding: 12px 20px !important;
      }
      h1 {
        font-size: 20px !important;
      }
      h2 {
        font-size: 18px !important;
      }
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:30px 10px;">

        <!-- Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          class="container"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:8px;
            overflow:hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">Byte Brief</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="content" style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Password Reset Request</h2>

              <p style="margin:16px 0;">Hello ${username || "User"},</p>

              <p style="margin:16px 0;">
                You requested to reset your password. Use the OTP below:
              </p>

              <!-- OTP -->
              <div style="margin:30px 0; text-align:center;">
                <span
                  class="otp"
                  style="
                    display:inline-block;
                    padding:15px 30px;
                    font-size:28px;
                    letter-spacing:6px;
                    background:#f1f5f9;
                    border-radius:6px;
                    font-weight:bold;
                    color:#111827;
                  "
                >
                  ${otp}
                </span>
              </div>

              <p style="margin:16px 0;">
                This OTP is valid for <strong>5 minutes</strong>.
              </p>

              <p style="margin:16px 0;">
                If you did not request this, please ignore this email.
              </p>

              <p style="margin-top:30px;">
                Thanks,<br/>
                <strong>Byte Brief Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} Byte Brief. All rights reserved.
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>
</body>
</html>
`;

export { GenerateToken, OtpEmailTemplate };
