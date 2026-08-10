"use client";

import { useCallback, useEffect, useState } from "react";

import { getVAPIDKey, subscribePush, unsubscribePush } from "@/entities/notification/api/push.api";

type PushState = "default" | "granted" | "denied" | "unsupported";

function isSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

export function usePushNotification() {
  const [state, setState] = useState<PushState>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupported()) {
      setState("unsupported");
      return;
    }
    setState(Notification.permission as PushState);
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported()) return;
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setState(permission as PushState);
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const vapidKey = await getVAPIDKey();

      const existing = await registration.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await subscribePush(subscription);
    } catch (err) {
      console.error("Push subscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!isSupported()) return;
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await unsubscribePush(subscription.endpoint);
          await subscription.unsubscribe();
        }
      }
      setState("default");
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
