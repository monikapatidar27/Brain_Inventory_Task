const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.SECRET_KEY);
};

module.exports = generateAccessToken;
