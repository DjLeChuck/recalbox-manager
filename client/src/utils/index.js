export const languages = {
  ar: 'Argentina',
  ca: 'Catalan',
  cn: '中国语文',
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  hu: 'Hungarian',
  it: 'Italiano',
  ko: '한국말',
  lv: 'Latviešu',
  pl: 'Język polski',
  pt: 'Português',
  'pt-BR': 'Português brasileiro',
  ru: 'Русский',
  tr: 'Turkish',
  ua: 'українська мова',
  zh: '中國語文',
};

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

let currentPromises = [];
const cancelablePromise = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val), //eslint-disable-line prefer-promise-reject-errors
      error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error) //eslint-disable-line prefer-promise-reject-errors
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export function cancelPromises() {
  for (const promise of currentPromises) {
    promise.cancel();
  }

  currentPromises = [];
}

export function promisifyData(...calls) {
  const promises = [];

  for (const promise of [...calls]) {
    currentPromises.push(cancelablePromise(promise));
  }

  for (const promise of currentPromises) {
    promises.push(promise.promise);
  }

  return Promise.all(promises).then(
    (values) => {
      let newState = {};

      for (const value of values) {
        Object.assign(newState, value);
      }

      return newState;
    },
    err => console.error(err)
  );
}

let cookies;

export function readCookie(name) {
  if (cookies) {
    return cookies[name];
  }

  const c = document.cookie.split('; ');
  cookies = {};

  for (let i = c.length-1; i >= 0; i--) {
    const C = c[i].split('=');
    cookies[C[0]] = C[1];
  }

  return cookies[name];
}
