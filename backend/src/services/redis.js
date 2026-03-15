import Redis from 'ioredis';

let client;

function getRedisClient() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 3000);
      },
    });

    client.on('connect', () => console.log('[redis] Connected'));
    client.on('error', (err) => console.error('[redis] Error:', err.message));
  }
  return client;
}

export { getRedisClient };
