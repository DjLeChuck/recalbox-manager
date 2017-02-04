function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;

    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

/**
 * grep values from recalbox.conf
 */
export function grep(keys) {
  return fetch(`/grep?keys=${keys.join('|')}`)
    .then(checkStatus)
    .then(parseJSON);
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
