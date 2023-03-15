export class CustomCache<V> {
  protected capacity: number;
  protected cache: { [key: string]: LFULRUCacheItem<V> };
  protected head: LFULRUCacheItem<V> | null;
  protected tail: LFULRUCacheItem<V> | null;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = {};
    this.head = null;
    this.tail = null;
  }

  protected removeItem(item: LFULRUCacheItem<V>) {
    if (item === this.head) {
      this.head = item.next;
    }
    if (item === this.tail) {
      this.tail = item.prev;
    }
    if (item.prev) {
      item.prev.next = item.next;
    }
    if (item.next) {
      item.next.prev = item.prev;
    }
  }

  protected insertItem(item: LFULRUCacheItem<V>) {
    item.frequency += 1;
    item.lastAccessed = Date.now();
    if (!this.head || !this.tail) {
      this.head = item;
      this.tail = item;
      return;
    }
    if (item.frequency > this.head.frequency) {
      item.next = this.head;
      this.head.prev = item;
      this.head = item;
      return;
    }
    let curr = this.head;
    while (curr.next !== null && curr.next.frequency >= item.frequency) {
      curr = curr.next;
    }
    item.prev = curr;
    item.next = curr.next;
    if (curr.next) {
      curr.next.prev = item;
    } else {
      this.tail = item;
    }
    curr.next = item;
  }

  get(key: string): V | undefined {
    const item = this.cache[key];
    if (!item) {
      return undefined;
    }
    this.removeItem(item);
    this.insertItem(item);
    return item.value;
  }

  set(key: string, value: V): void {
    if (this.cache[key]) {
      const item = this.cache[key];
      item.value = value;
      this.removeItem(item);
      this.insertItem(item);
    } else {
      const newItem: LFULRUCacheItem<V> = {
        key,
        value,
        frequency: 0,
        lastAccessed: Date.now(),
        prev: null,
        next: null,
      };
      if (Object.keys(this.cache).length >= this.capacity) {
        const leastFrequentlyUsed = this.tail;
        if (leastFrequentlyUsed) {
          this.removeItem(leastFrequentlyUsed);
          delete this.cache[leastFrequentlyUsed.key];
        }
      }
      this.cache[key] = newItem;
      this.insertItem(newItem);
    }
  }

  has(key: string): boolean {
    return !!this.cache[key];
  }

  delete(key: string): void {
    const item = this.cache[key];
    if (item) {
      this.removeItem(item);
      delete this.cache[key];
    }
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.cache = {};
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
