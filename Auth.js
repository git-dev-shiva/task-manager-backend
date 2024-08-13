const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  const token = req.headers.jwttoken;
  if (token) {
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res.status(200).json({
          message: "please login again",
        });
      }
      req.user = decoded.data;
      next();
    });
  } else {
    res.status(400).json({
      message: "user not authenticates",
    });
  }
};
module.exports = verify;
