function checkStatus(response) {
  if (response.ok) {
    return response;
  }

  return response.json().then(err => { throw err; });
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
export function get(option, param = undefined) {
  let url = `/get?option=${option}`;

  if (undefined !== param) {
    url += `&param=${param}`;
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
 * save values to recalbox.conf
 */
export function save(values) {
  return fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function recalboxSupport() {
  return fetch('/recalbox-support')
    .then(checkStatus)
    .then(parseJSON);
}
