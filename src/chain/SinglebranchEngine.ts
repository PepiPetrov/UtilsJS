export class SinglebranchEngine<T> {
  public branch: Branch<T> = {
    fns: [],
    middlewares: [],
    nestedBranches: [],
    errHandler: console.error,
    priority: 1,
    whenCondition: _ => true,
  };
  public context: Map<any, any> = new Map();

  addToBranch(fn: ChainedFunction<any, any>) {
    this.branch.fns.push(fn);

    return this;
  }

  setBranchWhenCondition(condition: ConditionFn) {
    this.branch.whenCondition = condition;

    return this;
  }

  addLogger(message: string) {
    const logger = (x: T) => {
      console.log(message.replace('$val', String(x)));
      return x;
    };

    this.addToBranch(logger);

    return this;
  }

  setErrorHandler(errorHandler: ErrorHandlerFunction) {
    this.branch!.errHandler = errorHandler;

    return this;
  }

  useInBrach(middleware: ChainedFunction<T, T>) {
    this.branch.middlewares.push(middleware);

    return this;
  }

  async runAll(value: T) {
    if (!this.branch?.whenCondition(value)) {
      return value;
    }
    let result: T = value;

    for (const middleware of this.branch.middlewares) {
      try {
        result = await middleware(result);
      } catch (e) {
        await this.branch.errHandler(e as Error);
      }
    }

    for (const fn of this.branch.fns) {
      try {
        result = await fn(result);
      } catch (e) {
        await this.branch.errHandler(e as Error);
      }
    }

    return result;
  }
}
