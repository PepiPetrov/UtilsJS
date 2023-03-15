export class LRUCache<K, V> {
  protected capacity: number;
  protected cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get size() {
    return this.cache.size;
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
    this.cache.forEach(callbackFn);
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (!value) {
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.keysIterator().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K) {
    return this.cache.has(key);
  }

  delete(key: K) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  batchSet(items: any[], batchSize: number = 100) {
    const numBatches = Math.ceil(items.length / batchSize);
    for (let i = 0; i < numBatches; i++) {
      const batchStart = i * batchSize;
      const batchEnd = Math.min((i + 1) * batchSize, items.length);
      const batchItems = items.slice(batchStart, batchEnd);
      batchItems.forEach(([key, value]) => this.set(key, value));
    }
  }
}
