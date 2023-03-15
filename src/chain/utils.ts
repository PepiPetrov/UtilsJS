export function createEmptyBranch<T>(branchPriority: number = 1): Branch<T> {
  return {
    fns: [],
    middlewares: [],
    errHandler: console.error,
    priority: branchPriority,
    whenCondition: _ => true,
  };
}
