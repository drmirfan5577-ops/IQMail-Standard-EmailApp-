exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  if (event.httpMethod === "POST") {
    try {
      const emailData = JSON.parse(event.body || "{}");
      console.log("✅ New Email Received:", emailData);

      return { 
        statusCode: 200, 
        body: JSON.stringify({ success: true, message: "Email received" }) 
      };
    } catch (error) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid data" }) };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
