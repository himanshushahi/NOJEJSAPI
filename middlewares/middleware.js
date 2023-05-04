import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      success: false,
      message: "Login First"
    });
  } else {
    const data = await User.findOne({ email: req.session.user.email });
    req.user = data;
    next();
  }
};

