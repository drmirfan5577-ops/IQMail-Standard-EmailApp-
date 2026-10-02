import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface EmailPayload {
  action: "list" | "get" | "send" | "update" | "delete";
  emailId?: string;
  category?: string;
  data?: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  };
}

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const payload: EmailPayload = event.body
      ? JSON.parse(event.body)
      : { action: "list" };

    switch (payload.action) {
      case "send": {
        if (!payload.data?.to || !payload.data?.subject) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: "Missing to or subject" }),
          };
        }

        // Resend API Call with exact authenticated domain sender
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "IQMail Admin <admin@send.iqmail.online>", // Verified Subdomain
            to: [payload.data.to],
            subject: payload.data.subject,
            html: payload.data.html || payload.data.text || "<p>Empty message</p>",
          }),
        });

        const resendResult = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error("Resend API Error:", resendResult);
          return {
            statusCode: resendResponse.status,
            headers,
            body: JSON.stringify({ success: false, error: resendResult }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Email sent via Resend", data: resendResult }),
        };
      }

      default:
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Action handler ready" }),
        };
    }
  } catch (error: any) {
    console.error("Email handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || "Internal server error" }),
    };
  }
};
