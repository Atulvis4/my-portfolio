import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient } from '../services/redis.js';

function createRateLimiter() {
  return rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please wait a few minutes before trying again.',
    },
    store: new RedisStore({
      sendCommand: (...args) => getRedisClient().call(...args),
    }),
    skip: (req) => {
      // Skip rate limiting if Redis is unavailable (fail open)
      try {
        const redisClient = getRedisClient();
        return redisClient.status !== 'ready';
      } catch {
        return true;
      }
    },
  });
}

export default createRateLimiter();
