exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod === "POST") {
    try {
      const emailData = JSON.parse(event.body || "{}");
      console.log("Inbound Email Packet Received via Cloudflare:", emailData);

      // Structure inbound mail packet
      const parsedEmail = {
        id: `msg_${Date.now()}`,
        from: emailData.from || "unknown@sender.com",
        to: emailData.to || "admin@iqmail.online",
        subject: emailData.subject || "(No Subject)",
        body: emailData.html || emailData.text || "",
        timestamp: new Date().toISOString(),
        category: "inbox"
      };

      // Output processed payload for app client binding
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Email received and parsed successfully",
          data: parsedEmail
        })
      };
    } catch (error) {
      console.error("Inbound Parsing Error:", error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Malformed email payload" })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
};
