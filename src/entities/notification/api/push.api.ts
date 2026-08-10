import { apiFetch } from "@/shared/api/client";

export async function getVAPIDKey(): Promise<string> {
  const res = await apiFetch<{ public_key: string }>("/admin/push/vapid-key");
  return res.public_key;
}

export async function subscribePush(subscription: PushSubscription) {
  const json = subscription.toJSON();
  return apiFetch<null>("/admin/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: {
        p256dh: json.keys?.p256dh,
        auth: json.keys?.auth,
      },
    }),
  });
}

export async function unsubscribePush(endpoint: string) {
  return apiFetch<null>("/admin/push/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint }),
  });
}
