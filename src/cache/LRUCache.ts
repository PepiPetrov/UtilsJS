export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get size(): number {
    return this.cache.size;
  }

  keysIterator(): IterableIterator<K> {
    return this.cache.keys();
  }

  valuesIterator(): IterableIterator<V> {
    return this.cache.values();
  }

  entriesIterator() {
    return this.cache.entries();
  }

  keys(): K[] {
    return Array.from(this.keysIterator());
  }

  values(): V[] {
    return Array.from(this.valuesIterator());
  }

  entries() {
    return Array.from(this.entriesIterator());
  }

  forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void): void {
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

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.keysIterator().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
