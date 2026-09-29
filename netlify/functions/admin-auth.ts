// Netlify Function: admin-auth
// Admin authentication handler — ready for Supabase Auth

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface AuthPayload {
  action: "login" | "logout" | "verify" | "change-password";
  password?: string;
  newPassword?: string;
  token?: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const payload: AuthPayload = event.body ? JSON.parse(event.body) : {};

    switch (payload.action) {
      case "login":
        // TODO: Verify against Supabase admin table
        // const { data, error } = await supabase.auth.signInWithPassword({
        //   email: process.env.ADMIN_EMAIL!,
        //   password: payload.password!,
        // })
        const isValid = payload.password === (process.env.ADMIN_PASSWORD || "iqmail2026");
        if (isValid) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              token: `iqmail-admin-${Date.now()}`,
              message: "Login successful",
            }),
          };
        }
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: "Invalid credentials" }),
        };

      case "verify":
        // TODO: Verify JWT token with Supabase
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, valid: true }),
        };

      case "logout":
        // TODO: Invalidate session in Supabase
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Logged out" }),
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Unknown action" }),
        };
    }
  } catch (error) {
    console.error("Auth handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
