type SortOrder = 'asc' | 'desc';

export function groupBy(array: any[], key: any) {
  return array.reduce((result, currentItem) => {
    const groupByKey = currentItem[key];
    if (!result[groupByKey]) {
      result[groupByKey] = [];
    }
    result[groupByKey].push(currentItem);
    return result;
  }, {});
}

export function pick(obj: any, keys: any[]) {
  const newObj: any = {};
  keys.forEach(key => {
    newObj[key] = obj[key];
  });

  return newObj;
}

export function pickBy(obj: any, predicate: (val: any) => boolean) {
  const newObj: any = {};

  Object.keys(obj).forEach(key => {
    if (predicate(obj[key])) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

export function deepClone(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let clonedObj: any = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    clonedObj[key] = deepClone(obj[key]);
  }

  return clonedObj;
}

export function zipObject(props: any[], values: any[]) {
  return props.reduce((obj, prop, index) => {
    obj[prop] = values[index];
    return obj;
  }, {});
}

export function zipObjectDeep(props: any[], values: any[]) {
  const result = {};

  props.forEach((prop, index) => {
    const parts = prop.split('.');
    let obj: any = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      obj[part] = obj[part] || {};
      obj = obj[part];
    }

    obj[parts[parts.length - 1]] = values[index];
  });

  return result;
}

export function orderBy<T extends object>(
  items: T[],
  fields: (keyof T)[],
  orders: SortOrder[]
): T[] {
  const compareValues = (a: any, b: any, order: SortOrder) => {
    if (order === 'desc') {
      return b > a ? 1 : b < a ? -1 : 0;
    }
    return a > b ? 1 : a < b ? -1 : 0;
  };

  const sortedItems = [...items];
  sortedItems.sort((a, b) => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const order = orders[i];
      const result = compareValues(a[field], b[field], order);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });

  return sortedItems;
}

export function isObject(val: any) {
  return typeof val == 'object' && val;
}
