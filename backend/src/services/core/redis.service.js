import logger from "../../utils/logger.js";

class InMemoryRedis {
  constructor() {
    this.store = new Map();
    this.status = "ready";
    logger.info("In-Memory Cache initialized");
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ...args) {
    let expiry = null;
    let nx = false;

    // Parse compatibility arguments
    // Usage: set(key, value, 'EX', 120, 'NX') or set(key, value, 'NX') etc.
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "EX") {
        expiry = Date.now() + args[i + 1] * 1000;
        i++;
      } else if (args[i] === "NX") {
        nx = true;
      }
    }

    if (nx && this.store.has(key)) {
      const item = this.store.get(key);
      if (!item.expiry || Date.now() < item.expiry) {
        return null; // Equivalent to Redis NX failing
      }
    }

    this.store.set(key, { value, expiry });
    return "OK";
  }

  async del(key) {
    if (Array.isArray(key)) {
      key.forEach((k) => this.store.delete(k));
    } else {
      this.store.delete(key);
    }
    return 1;
  }

  async keys(pattern) {
    if (!pattern) return [];
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    const keys = [];
    for (const key of this.store.keys()) {
      if (regex.test(key)) keys.push(key);
    }
    return keys;
  }
}

class RedisService {
  constructor() {
    this.client = new InMemoryRedis();
  }

  /**
   * Get cached data or fetch fresh data and cache it
   * @param {string} key Cache key
   * @param {function} fetchCallback Function to fetch data if cache miss
   * @param {number} ttl Time to live in seconds (default 60)
   */
  async getOrSetCache(key, fetchCallback, ttl = 60) {
    try {
      const cachedData = await this.client.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const freshData = await fetchCallback();
      if (freshData !== undefined && freshData !== null) {
        await this.client.set(key, JSON.stringify(freshData), "EX", ttl);
      }
      return freshData;
    } catch (error) {
      logger.error(`Cache Error for key ${key}:`, { error: error.message });
      return await fetchCallback();
    }
  }

  /**
   * Clear cache for a specific key
   */
  async clearCache(key) {
    if (this.client) {
      await this.client.del(key);
    }
  }

  /**
   * Clear multiple keys by pattern (SLOW operation, use carefully)
   */
  async clearPattern(pattern) {
    if (this.client) {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    }
  }
}

export default new RedisService();
