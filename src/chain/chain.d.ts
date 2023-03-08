declare type ChainedFunction<T, R> = (value: T) => R;
declare type ErrorHandlerFunction = (error: Error) => void | Promise<void>;
declare type ConditionFn = (value: any) => boolean;

declare interface Branch<T> {
  fns: ChainedFunction<T, T>[];
  middlewares: ChainedFunction<T, T>[];
  nestedBranches: Branch<T>[];
  errHandler: ErrorHandlerFunction;
  whenCondition: ConditionFn;
  priority: number;
}
