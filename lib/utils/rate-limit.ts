import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 1, // Per second
});

export async function checkRateLimit(key: string): Promise<boolean> {
  try {
    await rateLimiter.consume(key);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getRateLimitInfo(key: string) {
  const res = await rateLimiter.get(key);
  return {
    remainingPoints: res ? rateLimiter.points - res.consumedPoints : rateLimiter.points,
    msBeforeNext: res ? res.msBeforeNext : 0,
  };
}
