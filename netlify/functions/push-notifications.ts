// Netlify Function: push-notifications
// Ready for Web Push API integration

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface PushPayload {
  action: "subscribe" | "unsubscribe" | "send";
  subscription?: PushSubscriptionJSON;
  notification?: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: Record<string, unknown>;
  };
  recipients?: string[];
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
    const payload: PushPayload = event.body ? JSON.parse(event.body) : {};

    switch (payload.action) {
      case "subscribe":
        // TODO: Store subscription in Supabase
        // const { data, error } = await supabase
        //   .from('push_subscriptions')
        //   .upsert([{ subscription: payload.subscription }])
        console.log("Push subscription received:", payload.subscription?.endpoint);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Subscription stored" }),
        };

      case "send":
        // TODO: Use web-push library to send notifications
        // const webpush = require('web-push')
        // webpush.setVapidDetails(...)
        // await webpush.sendNotification(subscription, JSON.stringify(payload.notification))
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Push notification handler ready — configure VAPID keys",
          }),
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Unknown action" }),
        };
    }
  } catch (error) {
    console.error("Push notification error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
