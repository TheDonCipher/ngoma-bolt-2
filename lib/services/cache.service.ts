"use client";

import { createClient } from "redis";

const client = createClient({
  url: process.env.NEXT_PUBLIC_REDIS_URL,
});

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export const cacheService = {
  async connect() {
    if (!client.isOpen) {
      await client.connect();
    }
  },

  async get(key: string) {
    await this.connect();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl?: number) {
    await this.connect();
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await client.setEx(key, ttl, stringValue);
    } else {
      await client.set(key, stringValue);
    }
  },

  async invalidate(pattern: string) {
    await this.connect();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  }
};
