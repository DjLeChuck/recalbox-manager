import set from 'lodash.set';

export function getDefaultValues(values) {
  const result = {};

  for (const key of Object.keys(values)) {
    set(result, key, values[key]);
  }

  return result;
}
