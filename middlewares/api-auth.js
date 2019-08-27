const config = require('config');

const verifyApiUser = async (req, res, next) => {
  console.log(req.headers);
  if (req.headers['x-access-token'] !== config.get('accesskey')) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  return next();
}
module.exports = verifyApiUser;
