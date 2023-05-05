import User from "../models/user.js";
import bcrypt from "bcrypt";

const registerNewUser = async (req, res) => {
  const { name, email, password, age, city, pin } = req.body;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const findUser = await User.find({ email: email });
  if (findUser.length === 0) {
    try {
      await User.create({
        name,
        email,
        password: passwordHash,
        age,
        city,
        pin,
      });

      res.status(201).json({
        success: true,
        message: "Registered Successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Internal Server Error",
      });
      console.log(error);
    }
  } else {
    res.json({
      success: false,
      message: "The Email Is Already Exist",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The Email Is Not Registerd",
      });
    }

    // Compare the plain text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords match, log in the user
    if (isMatch) {
      res
        .cookie("_email", email, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "strict",
          secure: true,
        })

        .status(200)
        .json({
          success: true,
          message: "Welcome " + user.name,
        });
    } else {
      res.status(401).json({
        success: false,
        message: "incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMyDetails = async (req, res) => {
  const { _email } = req.cookies;
  const data = await User.findOne({ email: _email });
  // res.status(200).json({
  //   success: true,
  //   data
  // });
  res.json({
    message:"this is from get my details"
  })
};

const logoutUser = async (req, res) => {
  const { _email } = req.cookies;
  if (!_email) {
    return res.json({
      success: false,
      message: "Login First",
    });
  } else {
    res
      .cookie("_email", "", {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logout Successfully",
      });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { _email } = req.cookies;
    const { name, age, city, pin } = req.body;
    const user = await User.findOneAndUpdate(
      { email: _email },
      {
        name,
        age,
        city,
        pin,
      },
      { new: true }
    );
    if (user) {
      res.status(200).json({
        success: true,
        message: "Information Updated Successfully",
        user,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Some error with updating the data",
    });
  }
};

export {
  registerNewUser,
  loginUser,
  getMyDetails,
  logoutUser,
  updateUserDetails,
};
