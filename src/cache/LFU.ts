export class LFUCache<K, V> {
  protected capacity: number;
  protected cache: Map<K, CacheNode<K, V>>;
  protected frequencyList: Map<number, Set<CacheNode<K, V>>>;
  protected minFrequency: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.frequencyList = new Map();
    this.minFrequency = 0;
  }

  get size() {
    return this.cache.size;
  }

  protected increaseFrequency(node: CacheNode<K, V>): void {
    const frequency = node.frequency;
    const nodes = this.frequencyList.get(frequency) as Set<CacheNode<K, V>>;
    nodes.delete(node);

    if (frequency === this.minFrequency && nodes.size === 0) {
      this.minFrequency++;
    }

    node.frequency++;
    if (!this.frequencyList.has(node.frequency)) {
      this.frequencyList.set(node.frequency, new Set());
    }
    const newNodes = this.frequencyList.get(node.frequency) as Set<
      CacheNode<K, V>
    >;
    newNodes.add(node);
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;
    this.increaseFrequency(node);
    return node.value;
  }

  set(key: K, value: V): void {
    if (this.capacity <= 0) return;

    const node = this.cache.get(key);
    if (node) {
      node.value = value;
      this.increaseFrequency(node);
      return;
    }

    if (this.cache.size >= this.capacity) {
      const nodes = this.frequencyList.get(this.minFrequency) as Set<
        CacheNode<K, V>
      >;
      const lruNode = nodes.values().next().value;
      nodes.delete(lruNode);
      this.cache.delete(lruNode.key);
    }

    const newNode: CacheNode<K, V> = {
      key,
      value,
      frequency: 1,
    };
    this.cache.set(key, newNode);
    if (!this.frequencyList.has(1)) {
      this.frequencyList.set(1, new Set());
    }
    const nodes = this.frequencyList.get(1) as Set<CacheNode<K, V>>;
    nodes.add(newNode);
    this.minFrequency = 1;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;
    const nodes = this.frequencyList.get(node.frequency) as Set<
      CacheNode<K, V>
    >;
    nodes.delete(node);
    if (node.frequency === this.minFrequency && nodes.size === 0) {
      this.minFrequency++;
    }
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.frequencyList.clear();
    this.minFrequency = 0;
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
