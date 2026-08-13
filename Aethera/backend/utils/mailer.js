const { Resend } = require('resend');
const resendKey = process.env.RESEND_API_KEY || 're_123456789_dummy_dev_key';
const resend = new Resend(resendKey);

/**
 * Sends a verification/activation email using Resend
 * @param {string} toEmail 
 * @param {string} token 
 */
async function sendVerificationEmail(toEmail, token) {
  const verifyLink = `${process.env.APP_URL}/verify-email?token=${token}`;
  const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  const emailHtml = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: right;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 40px;">⚡</span>
        <h1 style="color: #a78bfa; margin-top: 10px; font-weight: 800; letter-spacing: 1px;">MINDSPARK</h1>
        <p style="color: #9ca3af; font-size: 14px; margin-top: -10px;">نسخة الجامعة</p>
      </div>
      
      <div style="background-color: #111827; border-radius: 8px; padding: 24px; border: 1px solid #374151; margin-bottom: 24px;">
        <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #374151; padding-bottom: 10px;">تفعيل حسابك الأكاديمي</h2>
        <p style="color: #d1d5db; line-height: 1.8; font-size: 15px; margin-bottom: 24px;">
          شكراً لتسجيلك في منصة **MindSpark**! يرجى تفعيل حسابك لتتمكن من استخدام جميع الأدوات والخدمات الأكاديمية والذكية المتاحة.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 35px; font-size: 15px; font-weight: bold; border-radius: 6px; display: inline-block; transition: background-color 0.3s; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">
            تفعيل الحساب
          </a>
        </div>
      </div>
      
      <p style="color: #6b7280; font-size: 12px; line-height: 1.6; text-align: center; border-top: 1px solid #1f2937; padding-top: 20px; margin-top: 20px;">
        إذا لم تقم بطلب هذا التفعيل، يرجى تجاهل هذا البريد الإلكتروني.<br>
        أو يمكنك نسخ الرابط التالي ولصقه في متصفحك مباشرة:<br>
        <a href="${verifyLink}" style="color: #8b5cf6; text-decoration: underline; word-break: break-all;">${verifyLink}</a>
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `MindSpark <${emailFrom}>`,
      to: toEmail,
      subject: 'تفعيل حسابك في MindSpark',
      html: emailHtml
    });

    if (error) {
      console.error('Error returned from Resend API:', error);
      throw new Error(`Resend API Error: ${error.message || JSON.stringify(error)}`);
    }

    console.log(`Verification email sent successfully via Resend to: ${toEmail}. ID: ${data?.id}`);
    return data;
  } catch (err) {
    console.error('Failed to send verification email via Resend:', err);
    throw new Error(`Mailer Error: ${err.message}`);
  }
}

module.exports = {
  sendVerificationEmail
};
