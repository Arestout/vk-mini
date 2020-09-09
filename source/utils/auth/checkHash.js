import qs from 'query-string';
import crypto from 'crypto';

export function checkHash(urlParams) {
  const ordered = {};
  Object.keys(urlParams)
    .sort()
    .forEach(key => {
      if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
      }
    });

  const stringParams = qs.stringify(ordered);
  const paramsHash = crypto
    .createHmac('sha256', secretKey)
    .update(stringParams)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=$/, '');

  return paramsHash === urlParams.sign;
}
