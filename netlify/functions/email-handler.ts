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
            body: JSON.stringify({ success: false, error: "Missing required fields: to or subject" }),
          };
        }

        // Active Resend API Integration
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: "RESEND_API_KEY environment variable is missing" }),
          };
        }

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "IQMail Admin <admin@send.iqmail.online>",
            to: [payload.data.to],
            subject: payload.data.subject,
            html: payload.data.html || payload.data.text || "<p>No content provided</p>",
          }),
        });

        const resendResult = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error("Resend API Delivery Error:", resendResult);
          return {
            statusCode: resendResponse.status,
            headers,
            body: JSON.stringify({ success: false, error: resendResult }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Email successfully dispatched via Resend", data: resendResult }),
        };
      }

      default:
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Handler operational" }),
        };
    }
  } catch (error: any) {
    console.error("Fatal Email Handler Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || "Internal Server Error" }),
    };
  }
};
