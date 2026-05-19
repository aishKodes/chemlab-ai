type RateRecord = {
  date: string;
  count: number;
};

const usage = new Map<string, RateRecord>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyLimit(isAuthenticated: boolean) {
  const fallback = isAuthenticated ? 40 : 12;
  const envValue = isAuthenticated
    ? process.env.AI_DAILY_LIMIT_FREE_USER
    : process.env.AI_DAILY_LIMIT_ANONYMOUS;
  const parsed = Number(envValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function checkRateLimit(key: string, isAuthenticated = false) {
  const date = todayKey();
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
