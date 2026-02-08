import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  throw new Error("VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY não definidos");
}

webpush.setVapidDetails("mailto:support@finflow.app", publicKey, privateKey);

export type WebPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function sendWebPush(sub: WebPushSubscription, payload: unknown) {
  return webpush.sendNotification(sub as any, JSON.stringify(payload));
}
