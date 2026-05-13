import { createClient } from 'redis';
import { config } from '@config/index';

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;
