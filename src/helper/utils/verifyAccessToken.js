const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");

const verifyAccessToken = async (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async function (err, user) {
      if (err) {
        return res.status(401).json({
          sucess: false,
          result: { message: "Access Token Not Valid" },
        });
      }
      const loggedInUser = await userModel.findById(user.id);
      req.user = loggedInUser;

      next();
    });
  } else {
    return res.status(401).json({
      sucess: false,
      result: { message: "Access Token is not set in request header" },
    });
  }
};

module.exports = verifyAccessToken;
