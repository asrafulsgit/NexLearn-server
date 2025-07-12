const jwt = require('jsonwebtoken');

const studentAuthentication = async (req, res, next) => {
  const { nluAccessToken } = req.cookies;

  try {
    if (!nluAccessToken) {
      return res.status(401).send({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const verifyToken = jwt.verify(nluAccessToken, process.env.JWT_ACCESS_TOKEN);
    req.student = verifyToken;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};

module.exports = studentAuthentication;
