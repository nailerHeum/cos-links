const config = require('config');

const verifyApiUser = (req, res, next) => {
  if (req.headers['x-access-token'] !== config.get('accesskey')) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  return next();
}
module.exports = verifyApiUser;
