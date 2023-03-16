import isObject from 'lodash.isobject';

export function partition(
  arr: any[],
  predicate: (val: any) => boolean
): any[][] {
  const truthy = [];
  const falsey = [];

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (typeof predicate === 'function') {
      if (predicate(element)) {
        truthy.push(element);
      } else {
        falsey.push(element);
      }
    } else if (typeof predicate === 'string') {
      if (element[predicate]) {
        truthy.push(element);
      } else {
        falsey.push(element);
      }
    } else if (Array.isArray(predicate)) {
      const value = element[predicate[0]];
      const expected = predicate[1];
      if (value === expected) {
        truthy.push(element);
      } else {
        falsey.push(element);
      }
    } else if (isObject(predicate)) {
      const keys = Object.keys(predicate);
      let isTruthy = true;
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (element[key] !== predicate[key]) {
          isTruthy = false;
          break;
        }
      }
      if (isTruthy) {
        truthy.push(element);
      } else {
        falsey.push(element);
      }
    }
  }

  return [truthy, falsey];
}

export function countBy(collection: any[], iteratee: (val: any) => any) {
  return collection.reduce((result, item) => {
    const key = iteratee(item);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}
