const crypto = require('crypto')

module.exports.uid = (len) => {
  return crypto.randomBytes(Math.ceil(Math.max(8, len * 2)))
    .toString('base64')
    .replace(/[+/]/g, '')
    .slice(0, len)
}
