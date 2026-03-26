const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail({ to, subject, htmlContent, textContent }: SendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY not set, skipping email");
    return null;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@seoworld.co.kr";
  const senderName = process.env.BREVO_SENDER_NAME || "SEO월드";

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to,
      subject,
      htmlContent,
      ...(textContent ? { textContent } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo email error:", error);
    return null;
  }

  return response.json();
}

// 문의 접수 알림 이메일
export async function sendInquiryNotification({
  name,
  email,
  company,
  serviceType,
  message,
}: {
  name: string;
  email: string;
  company?: string;
  serviceType: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "vnfm0580@gmail.com";

  // 관리자에게 알림
  await sendEmail({
    to: [{ email: adminEmail, name: "SEO월드 관리자" }],
    subject: `[SEO월드] 새 문의 접수 — ${serviceType}`,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">새로운 서비스 문의가 접수되었습니다</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666; width: 100px;">서비스</td>
            <td style="padding: 8px 0; font-weight: bold;">${serviceType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666;">이름</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666;">이메일</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${company ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666;">회사</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 8px 0; color: #666; vertical-align: top;">내용</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 24px;">
          <a href="https://seoworld.co.kr/admin/inquiries"
             style="background: #2563EB; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
            관리자 페이지에서 확인
          </a>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          이 이메일은 seoworld.co.kr에서 자동 발송되었습니다.
        </p>
      </div>
    `,
  });

  // 고객에게 접수 확인 이메일
  await sendEmail({
    to: [{ email, name }],
    subject: `[SEO월드] 문의가 접수되었습니다`,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">문의가 접수되었습니다</h2>
        <p>${name}님, 안녕하세요.</p>
        <p>서비스 문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.</p>
        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>문의 서비스:</strong> ${serviceType}<br/>
            <strong>문의 내용:</strong> ${message.slice(0, 200)}${message.length > 200 ? "..." : ""}
          </p>
        </div>
        <p style="font-size: 14px; color: #666;">
          추가 문의사항이 있으시면 이 이메일에 회신해주세요.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">
          SEO월드 | <a href="https://seoworld.co.kr" style="color: #2563EB;">seoworld.co.kr</a>
        </p>
      </div>
    `,
  });
}
