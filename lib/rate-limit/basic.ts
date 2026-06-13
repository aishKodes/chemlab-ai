type RateRecord = {
  date: string;
  count: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number | null;
  remaining: number | null;
  reset: string;
  unlimited?: boolean;
};

const usage = new Map<string, RateRecord>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyLimit(isAuthenticated: boolean) {
  const fallback = isAuthenticated ? 40 : 12;
  const envValue = isAuthenticated
    ? process.env.FREE_USER_DAILY_AI_LIMIT || process.env.AI_DAILY_LIMIT_FREE_USER
    : process.env.ANONYMOUS_DAILY_AI_LIMIT || process.env.AI_DAILY_LIMIT_ANONYMOUS;
  const parsed = Number(envValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isLocalHostName(hostname: string | null | undefined) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function isDevelopmentAiUnlimited(request?: Request) {
  const explicitServerFlag = process.env.DEV_UNLIMITED_AI === "true";
  const explicitPublicFlag = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const isDevelopmentRuntime = process.env.NODE_ENV !== "production";

  let isLocalhost = false;
  if (request) {
    const urlHost = new URL(request.url).hostname;
    const headerHost = request.headers.get("host")?.split(":")[0];
    isLocalhost = isLocalHostName(urlHost) || isLocalHostName(headerHost);
  }

  return explicitServerFlag || explicitPublicFlag || isDevelopmentRuntime || isLocalhost;
}

export function checkRateLimit(
  key: string,
  isAuthenticated = false,
  options: { unlimited?: boolean } = {},
): RateLimitResult {
  const date = todayKey();
  if (options.unlimited) {
    return {
      allowed: true,
      limit: null,
      remaining: null,
      reset: date,
      unlimited: true,
    };
  }

  const limit = getDailyLimit(isAuthenticated);
  const current = usage.get(key);
  const nextRecord = current?.date === date ? current : { date, count: 0 };

  if (nextRecord.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: date,
    };
  }

  nextRecord.count += 1;
  usage.set(key, nextRecord);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - nextRecord.count),
    reset: date,
  };
}
