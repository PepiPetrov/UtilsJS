import LRUCache from 'lru-cache';

export class MultibranchEngine<T> {
  public branches: Map<string, Branch<T>> = new Map([
    [
      'main',
      {
        fns: [],
        middlewares: [],
        errHandler: console.error,
        priority: 1,
        whenCondition: _ => true,
      },
    ],
  ]);
  public context: Map<any, any> = new Map();
  public cache: LRUCache<string, any>;
  private cacheEnabled = false;

  constructor(maxItemsInCache: number = 15) {
    this.cache = new LRUCache({ max: maxItemsInCache });
  }

  addToBranch(name: string, fn: ChainedFunction<any, any>) {
    if (!this.branches.has(name)) {
      throw new Error(`Branch ${name} does not exist`);
    }

    const branch = this.branches.get(name)!;
    branch.fns.push(fn);

    this.branches.set(name, branch);

    return this;
  }

  addBranch(name: string, branchPriority: number) {
    if (!this.branches.has(name)) {
      this.branches.set(name, {
        fns: [],
        middlewares: [],
        priority: branchPriority,
        errHandler: console.error,
        whenCondition: _ => true,
      });
    } else {
      throw new Error(`Branch ${name} already exists`);
    }

    return this;
  }

  setBranchWhenCondition(branchName: string, condition: ConditionFn) {
    const branch = this.branches.get(branchName);
    if (!branch) {
      throw new Error(`Branch ${branchName} does not exist!`);
    }
    branch!.whenCondition = condition;
    this.branches.set(branchName, branch);

    return this;
  }

  removeBranch(name: string) {
    if (name !== 'main') {
      this.branches.delete(name);
      this.cache.delete(name);
    } else {
      throw new Error('Cannot remove branch main!');
    }

    return this;
  }

  addLoggerToBranch(name: string, message: string) {
    const logger = (x: T) => {
      console.log(message.replace('$val', String(x)));
      return x;
    };

    this.addToBranch(name, logger);

    return this;
  }

  setErrorHandlerBranch(
    name: string = 'main',
    errorHandler: ErrorHandlerFunction
  ) {
    const branch = this.branches.get(name);
    if (!branch) {
      throw new Error(`Branch ${name} does not exist`);
    }

    branch.errHandler = errorHandler;

    this.branches.set(name, branch);

    return this;
  }

  useInBrach(name: string, middleware: ChainedFunction<T, T>) {
    const branch = this.branches.get(name)!;
    branch.middlewares.push(middleware);

    this.branches.set(name, branch);

    return this;
  }

  async runBranch(name: string, value: T): Promise<T> {
    const branch = this.branches.get(name);
    if (!branch?.whenCondition(value)) {
      return value;
    }

    if (!branch) {
      throw new Error(`Branch ${name} does not exist`);
    }

    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    let result: T = value;

    for (const middleware of branch.middlewares) {
      try {
        result = await middleware(result);
      } catch (e) {
        await branch.errHandler(e as Error);
      }
    }

    for (const fn of branch.fns) {
      try {
        result = await fn(result);
      } catch (e) {
        await branch.errHandler(e as Error);
      }
    }

    this.addToCache(name, result);

    return result;
  }

  async runAll(value: T, passMainResultToBranches: boolean = false) {
    const mainRes = await this.runBranch('main', value);
    const names: string[] = Array.from(this.branches.keys())
      .filter(name => name !== 'main')
      .sort((a, b) => {
        return this.branches.get(a)!.priority - this.branches.get(b)!.priority;
      });

    const resultsMap: Record<string, T> = {};
    names.map(async name => {
      const res = await this.runBranch(
        name,
        passMainResultToBranches ? mainRes : value
      );
      resultsMap[name] = res;
    });

    return resultsMap;
  }

  private addToCache(key: string, value: any) {
    if (this.cacheEnabled) {
      this.cache.set(key, value);
    }
    return this;
  }

  enableCache() {
    this.cacheEnabled = true;
    return this;
  }

  disableCache() {
    this.cacheEnabled = false;
    return this;
  }

  clearCache() {
    this.cache.clear();
    return this;
  }
}
