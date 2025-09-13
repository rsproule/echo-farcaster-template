import { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import { Redis } from "@upstash/redis";
import { APP_NAME } from "./constants";

// In-memory fallback storage
const localStore = new Map<string, MiniAppNotificationDetails>();
const handoffStore = new Map<string, { value: unknown; expiresAt: number }>();

// Use Redis if KV env vars are present, otherwise use in-memory
const useRedis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
const redis = useRedis
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null;

function getUserNotificationDetailsKey(fid: number): string {
  return `${APP_NAME}:user:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number,
): Promise<MiniAppNotificationDetails | null> {
  const key = getUserNotificationDetailsKey(fid);
  if (redis) {
    return await redis.get<MiniAppNotificationDetails>(key);
  }
  return localStore.get(key) || null;
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: MiniAppNotificationDetails,
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid);
  if (redis) {
    await redis.set(key, notificationDetails);
  } else {
    localStore.set(key, notificationDetails);
  }
}

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  const key = getUserNotificationDetailsKey(fid);
  if (redis) {
    await redis.del(key);
  } else {
    localStore.delete(key);
  }
}

// --- Echo handoff state helpers ---
function getHandoffKey(state: string): string {
  return `${APP_NAME}:handoff:${state}`;
}

export async function setHandoffReady(
  state: string,
  value: unknown,
  ttlSeconds: number = 120,
): Promise<void> {
  const key = getHandoffKey(state);
  if (redis) {
    await redis.set(key, { value }, { ex: ttlSeconds });
  } else {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    handoffStore.set(key, { value, expiresAt });
    setTimeout(() => {
      const existing = handoffStore.get(key);
      if (existing && existing.expiresAt <= Date.now()) {
        handoffStore.delete(key);
      }
    }, ttlSeconds * 1000 + 50);
  }
}

export async function getHandoffValue(state: string): Promise<unknown | null> {
  const key = getHandoffKey(state);
  if (redis) {
    return (await redis.get<{ value: unknown }>(key))?.value ?? null;
  }
  const entry = handoffStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    handoffStore.delete(key);
    return null;
  }
  return entry.value ?? null;
}

export async function deleteHandoffState(state: string): Promise<void> {
  const key = getHandoffKey(state);
  if (redis) {
    await redis.del(key);
  } else {
    handoffStore.delete(key);
  }
}
