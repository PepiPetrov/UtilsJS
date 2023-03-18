export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function memoize(func: (...args: any[]) => any) {
  const cache: any = {};
  return function(this: any, ...args: any[]) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = func.apply(this, args);
    cache[key] = result;
    return result;
  };
}

export function compose(...funcs: Function[]) {
  return function(arg: any) {
    return funcs.reduceRight((acc, func) => func(acc), arg);
  };
}

export function isFunction(val: any) {
  return typeof val === 'function';
}
