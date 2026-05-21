import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private isConnected = false;

  constructor() {
    super({
      host: 'localhost',
      port: 6379,
      retryStrategy: (times) => {
        // Stop retrying after 10 attempts
        if (times > 10) {
          console.warn('⚠️  Redis connection failed. Running without Redis cache.');
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
      },
      enableReadyCheck: false,
      enableOfflineQueue: false,
    });

    this.on('connect', () => {
      this.isConnected = true;
      console.log('🟢 Connected to Redis');
    });

    this.on('error', (err) => {
      this.isConnected = false;
      console.warn('⚠️  Redis error (cache will be skipped):', err.message);
    });
  }

  async onModuleDestroy() {
    await this.quit();
    console.log('🔴 Disconnected from Redis');
  }

  // ጠቃሚ ሜቶዶች
  async setJson(key: string, value: any, ttl?: number) {
    if (!this.isConnected) return; // Skip if Redis not available
    try {
      const jsonValue = JSON.stringify(value);
      if (ttl) {
        await this.setex(key, ttl, jsonValue);
      } else {
        await this.set(key, jsonValue);
      }
    } catch (err) {
      console.warn('⚠️  Redis setJson failed:', err.message);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null; // Return null if Redis not available
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.warn('⚠️  Redis getJson failed:', err.message);
      return null;
    }
  }
}