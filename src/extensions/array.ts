/*#__PURE__*/
export function chunk(array: any[], chunkSize: number) {
  var chunksArray = [];
  for (var i = 0; i < Math.ceil(array.length / chunkSize); i++) {
    chunksArray.push(array.slice(i * chunkSize, i * chunkSize + chunkSize));
  }

  return chunksArray;
}

/*#__PURE__*/
export function zip(...arrays: any[]) {
  const maxLength = Math.max(...arrays.map(array => array.length));
  const result = [];

  for (let i = 0; i < maxLength; i++) {
    result[i] = arrays.map(array => array[i]);
  }

  return result;
}

/*#__PURE__*/
export function zipWith(...arrays: any[]) {
  const iteratee = arrays.pop();

  const maxLength = Math.max(...arrays.map(array => array.length));
  const result = [];

  for (let i = 0; i < maxLength; i++) {
    const values = arrays.map(array => array[i]);
    result[i] = iteratee(...values);
  }

  return result;
}
