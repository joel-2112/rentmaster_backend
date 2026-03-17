import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      host: 'localhost',
      port: 6379,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.on('connect', () => {
      console.log('🔴 Connected to Redis');
    });

    this.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.quit();
    console.log('🔴 Disconnected from Redis');
  }

  // ጠቃሚ ሜቶዶች
  async setJson(key: string, value: any, ttl?: number) {
    const jsonValue = JSON.stringify(value);
    if (ttl) {
      await this.setex(key, ttl, jsonValue);
    } else {
      await this.set(key, jsonValue);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }
}