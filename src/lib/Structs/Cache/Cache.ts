type encodeFunction<T> = (data: CacheData<T>) => string;
type decodeFunction<T> = (data: string) => CacheData<T>;

interface CacheOptions<T> {
  encode: encodeFunction<T>;
  decode: decodeFunction<T>;
  prefix: string;
}

export class Cache<T> {
  private _encode: encodeFunction<T>;
  private _decode: decodeFunction<T>;
  private _prefix: string;
  private _cache: Map<string, CacheData<T>> = new Map();

  constructor({
    encode,
    decode,
    prefix,
  }: CacheOptions<T>) {
    this._encode = encode;
    this._decode = decode;
    this._prefix = prefix;
  }

  get(key: string): T | undefined {
    const rawKey = this._prefix + key;
    try {
      const data = this._cache.get(rawKey) || this._decode(localStorage.getItem(rawKey) || "");

      if (!data) return undefined;

      data.lastAccessed = Date.now();

      this._cache.set(rawKey, data);
      localStorage.setItem(rawKey, this._encode(data));

      return data.data;
    } catch {
      return undefined;
    }
  }

  set(key: string, data: T) {
    const rawKey = this._prefix + key;
    const cacheData = {
      data,
      lastAccessed: Date.now(),
      key: rawKey,
    }

    this._cache.set(rawKey, cacheData);
    localStorage.setItem(rawKey, this._encode(cacheData));

    const oldest = this.findOldest();

    if (oldest && oldest?.key !== rawKey) {
      this.remove(oldest.key);
    }

    return data;
  }

  remove(key: string) {
    const rawKey = this._prefix + key;

    this._cache.delete(rawKey);
    localStorage.removeItem(rawKey);
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