const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const upload = require("../helper/utils/multer");
const send = require("../helper/utils/send");
const { verificationLinkTemplate } = require("../helper/utils/templates");
const { isValidEmail } = require("../helper/utils/vaild");
const user = {};

user.signup = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!isValidEmail(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email address" });
      }

      if (!password || !confirmPassword || password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match or are missing",
        });
      }

      const existingUserEmail = await UserModel.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        profilePicture: req.file ? req.file.path : null,
        confirmationToken: token,
        isEmailConfirmed: false,
      });

      const savedUser = await newUser.save();

      const subject = "Verify Your Mail";
      const verificationUrl = `http://localhost:3000/api/v1/user/confirm/${token}`;
      
      console.log(verificationUrl);
      const body = verificationLinkTemplate(verificationUrl);
      console.log(body);
      await send({ email, name }, subject, body);

      return res.status(200).json({
        success: true,
        message:
          "User registered successfully. Please check your email to confirm your account",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });
};

user.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findOne({
      email: decoded.email,
      confirmationToken: token,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token or user not found" });
    }

    user.isEmailConfirmed = true;
    user.confirmationToken = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email confirmed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

user.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "No such user found" });
    }

    if (!user.isEmailConfirmed) {
      return res
        .status(400)
        .json({ message: "Email is not confirmed. Please check your email." });
    }

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = user;
