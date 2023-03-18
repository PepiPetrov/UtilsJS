type Value<V> = { value: V; size: number; expiration?: number };

export class LRUCache<K, V> {
  protected capacity: number;
  protected cache: Map<K, Value<V>>;
  protected calculateSize: (value: V) => number;

  constructor(capacity: number, calculateSize: (value: V) => number = _ => 1) {
    this.capacity = capacity;
    this.cache = new Map();
    this.calculateSize = calculateSize;
  }

  get size() {
    let totalSize = 0;
    this.cache.forEach(entry => {
      totalSize += entry.size;
    });
    return totalSize;
  }

  keysIterator() {
    return this.cache.keys();
  }

  valuesIterator() {
    return this.cache.values();
  }

  entriesIterator() {
    return this.cache.entries();
  }

  keys() {
    return Array.from(this.keysIterator());
  }

  values() {
    return Array.from(this.valuesIterator());
  }

  entries() {
    return Array.from(this.entriesIterator());
  }

  forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void) {
    this.cache.forEach((entry, key) =>
      callbackFn(
        entry.value,
        key,
        new Map(
          this.entries().map(x => {
            return [x[0], x[1].value];
          })
        )
      )
    );
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (entry.expiration && entry.expiration < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, {
      value: entry.value,
      size: entry.size,
      expiration: entry.expiration,
    });
    return entry.value;
  }

  set(key: K, value: V, ttl?: number) {
    const size = this.calculateSize(value);
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      this.cache.delete(key);
      this.capacity += entry.size;
    }
    while (this.cache.size >= this.capacity - size) {
      const firstKey = this.keysIterator().next().value;
      const entry = this.cache.get(firstKey)!;
      this.cache.delete(firstKey);
      this.capacity += entry.size;
    }
    const entry = { value, size, expiration: 0 };
    if (ttl) {
      entry.expiration = Date.now() + ttl;
    }
    this.capacity -= size;
    this.cache.set(key, entry);
  }

  has(key: K) {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    if (entry.expiration && entry.expiration < Date.now()) {
      this.cache.delete(key);
      this.capacity += entry.size;
      return false;
    }
    return true;
  }

  delete(key: K) {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.capacity += entry.size;
      return true;
    }
    return false;
  }

  clear() {
    this.cache.clear();
    this.capacity = 0;
  }

  batchSet(items: any[], batchSize: number = 100, ttl?: number) {
    const numBatches = Math.ceil(items.length / batchSize);
    for (let i = 0; i < numBatches; i++) {
      const batchStart = i * batchSize;
      const batchEnd = Math.min((i + 1) * batchSize, items.length);
      const batchItems = items.slice(batchStart, batchEnd);

      let totalSize = 0;
      const entries = batchItems.map(([key, value]) => {
        const size = this.calculateSize(value);
        totalSize += size;
        const entry = { value, size } as {
          key: K;
          value: V;
          size: number;
          expiration?: number;
        };
        if (ttl) {
          entry.expiration = Date.now() + ttl;
        }
        return { key, entry };
      });

      if (totalSize > this.capacity) {
        throw new Error(
          `Batch size too large, total size is ${totalSize}, capacity is ${this.capacity}`
        );
      }

      while (this.cache.size + entries.length > this.capacity) {
        const firstKey = this.keysIterator().next().value;
        const entry = this.cache.get(firstKey)!;
        this.cache.delete(firstKey);
        this.capacity += entry.size;
      }

      entries.forEach(({ key, entry }) => {
        this.cache.set(key, entry);
        this.capacity -= entry.size;
      });
    }
  }
}
