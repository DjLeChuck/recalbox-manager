export function diffObjects(prev, cur) {
  let newValues = Object.assign({}, prev, cur);
  let diff = {};

  for (const [key, value] of Object.entries(newValues)) {
    if (prev[key] !== value) {
      diff[key] = value;
    }
  }

  return diff;
}

export function cloneObject(obj) {
  return Object.assign({}, obj);
}

export function promisifyData(...calls) {
  const promises = [...calls];

  return Promise.all(promises).then((values) => {
    let newState = {};

    for (const value of values) {
      Object.assign(newState, value);
    }

    return newState;
  }).catch((err) => {
    console.error(err);
  });
}
