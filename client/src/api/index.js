import i18n from '../i18n';
import dotize from 'dotize';

let translatableConfig = require('../translatableConfig')(i18n);

i18n.on('languageChanged', () => {
  translatableConfig = require('../translatableConfig')(i18n);
});

/**
 * Function taken from npm config package
 * @see https://github.com/lorenwest/node-config/blob/master/lib/config.js#L134-L156
 *
 * Underlying get mechanism
 *
 * @private
 * @method getImpl
 * @param object {object} - Object to get the property for
 * @param property {string | array[string]} - The property name to get (as an
 * array or '.' delimited string)
 * @return value {*} - Property value, including undefined if not defined.
 */
const getImpl = (object, property) => {
  const elems = Array.isArray(property) ? property : property.split('.'),
    name = elems[0],
    value = object[name];

  if (elems.length <= 1) {
    return value;
  }

  // Note that typeof null === 'object'
  if (value === null || typeof value !== 'object') {
    return undefined;
  }

  return getImpl(value, elems.slice(1));
};

function checkStatus(response) {
  if (response.ok) {
    return response;
  }

  return response.json().then((err) => { throw err; });
}

function parseJSON(response) {
  return response.json();
}

function formatState(dataset) {
  let result = {};

  for (const [key, subdata] of Object.entries(dataset.data)) {
    result[key] = subdata.value;
  }

  return result;
}

function formatOption(dataset) {
  return dataset.data;
}

/**
 * get an option
 */
export function get(option, params) {
  let url = `/get?option=${option}`;

  if (undefined !== params) {
    url += `&params=${params}`;
  }

  return fetch(url)
    .then(checkStatus)
    .then(parseJSON)
    .then(formatOption);
}

/**
 * post an action
 */
export function post(action, body = {}) {
  return fetch(`/post?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(checkStatus)
    .then(parseJSON);
}

/**
 * grep values from recalbox.conf
 */
export function grep(keys) {
  return fetch(`/grep?keys=${keys.join('|')}`)
    .then(checkStatus)
    .then(parseJSON)
    .then(formatState);
}

/**
 * get values from config file
 */
export function conf(keys) {
  return fetch(`/conf?keys=${keys.join(',')}`)
    .then(checkStatus)
    .then(parseJSON);
}

/**
 * get values from translatable config file
 */
export function translatableConf(keys) {
  return new Promise((resolve, reject) => {
    try {
      let result = {};

      keys.forEach((key) => {
        result[key] = getImpl(translatableConfig, key);
      });

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * save values to recalbox.conf
 */
export function save(values) {
  return fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dotize.convert(values))
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function recalboxSupport() {
  return fetch('/recalbox-support')
    .then(checkStatus)
    .then(parseJSON);
}
