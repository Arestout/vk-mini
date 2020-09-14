import qs from 'query-string';
import crypto from 'crypto';

export const checkHash = (req, res, next) => {
  const urlParams = req.query;

  console.log(req.query);
  const secretKey = process.env.VKONTAKTE_APP_SECRET;
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

  if (paramsHash === urlParams.sign) {
    return next();
  } else {
    res.status(401).json({ message: 'Неправильные данные' });
  }
};
