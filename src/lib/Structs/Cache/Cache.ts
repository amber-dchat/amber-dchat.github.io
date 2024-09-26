interface CacheOptions<T> {
  prefix: string;
}

export class Cache<T> {
  private _prefix: string;
  private _cache: Map<string, CacheData<T>> = new Map();

  constructor({
    prefix,
  }: CacheOptions<T>) {
    this._prefix = prefix;
  }

  get size() {
    return this._cache.size;
  }

  get(key: string): T | undefined {
    const rawKey = this._prefix + key;

    const data = this._cache.get(rawKey);

    if (!data) return undefined;

    data.lastAccessed = Date.now();

    this._cache.set(rawKey, data);

    return data.data;
  }

  set(key: string, data: T) {
    const rawKey = this._prefix + key;
    const cacheData = {
      data,
      lastAccessed: Date.now(),
      key: rawKey,
    }

    this._cache.set(rawKey, cacheData);

    const oldest = this.findOldest();

    if (oldest && oldest?.key !== rawKey) {
      this.remove(oldest.key);
    }

    return data;
  }

  remove(key: string) {
    const rawKey = this._prefix + key;

    this._cache.delete(rawKey);
  }

  findOldest(): CacheData<T> | undefined {
    return [...this._cache.values()].sort((a, b) => a.lastAccessed - b.lastAccessed)[0];
  }
}

export interface CacheData<T> {
  data: T;
  lastAccessed: number;
  key: string;
}