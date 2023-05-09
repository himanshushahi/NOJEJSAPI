import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { _email } = req.cookies;
  if (!_email) {
    return res.json({
      success: false,
      message: "Login First",
    });
  } else {
    const data = await User.findOne({ email: _email });
    req.user = data;
    next();
  }
};

