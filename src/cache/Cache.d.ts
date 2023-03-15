declare type CacheNode<K, V> = {
  key: K;
  value: V;
  frequency: number;
};

declare interface LFULRUCacheItem<V> {
  key: string;
  value: V;
  frequency: number;
  lastAccessed: number;
  prev: LFULRUCacheItem<V> | null;
  next: LFULRUCacheItem<V> | null;
}
