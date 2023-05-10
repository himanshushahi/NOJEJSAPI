import User from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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
        message: "Incorrect Password",
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
  try {
    const data = await User.findOne({ email: _email });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success:false,
      message:"There Is Some Problem In The Server"
    })
  }
};

const logoutUser = async (req, res) => {
  const { _email } = req.cookies;
  try {
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
  } catch (error) {
    res.status(400).json({
      success:false,
      message:"We Could't Logout"
    })
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
      message: "Some Error With Updating The Data",
    });
  }
};

const sendMail = (req, res) => {
 try {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "himanshushahi0478@gmail.com",
      pass: process.env.MY_PASSWORD,
    },
  });

  let mailOptions = {
    from: req.body.email,
    to: "himanshushahi0478@gmail.com",
    subject: "New Form Submission From Site",
    text: `Name: ${req.body.name}\nMessage: ${req.body.message}\nEmail:${req.body.email}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400).json({
        success: false,
        message: "Internal Server Error Please Try After Some Time",
      });
    } else {
      res.status(200).json({
        success: true,
        message: `The Message Is Sent Successfully`,
      });
    }
  });
 } catch (error) {
  res.status(500).json({
    success:false,
    message:"Internal Server Error Please Try After Some Time",
  })
 }
};

const sendOtp = async (req, res, next) => {
  const { email } = req.body;

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email Address Format",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "The Email Is Not Registered",
    });
  } else {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "himanshushahi0478@gmail.com",
        pass: process.env.MY_PASSWORD,
      },
    });

    const number = "0123456789";
    let otp = "";

    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * number.length);
      otp += number.charAt(randomNum);
    }

    const savedUser = await User.findOneAndUpdate(
      { email },
      { otp },
      { new: true }
    );

    res.cookie("email_", email, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: true,
    });


    let mailOptions = {
      from: "himanshushahi0478@gmail.com",
      to: email,
      subject: "Forget Password",
      text: `The OTP Is ${otp} For Resetting The Password`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: `The OTP Has Been Sent Successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error, Please Try Again Later",
      });
    }
  }
};

const verifyOtp = async (req, res) => {
  const { email_ } = req.cookies;
  const { otp } = req.body;

  const user = await User.findOne({ email: email_ });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email Not Found",
    });
  } else {
    if (user.otp == 404) {
      return res.status(400).json({
        success: false,
        message: "The OTP doesn't match",
      });
    } else if (user.otp == otp) {
      res.status(200).json({
        success: true,
        message: "The OTP Match Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "The OTP doesn't match",
      });
    }
    setTimeout(async () => {
      await User.findOneAndUpdate(
        { email: email_ },
        {
          OTP: 404,
        },
        { new: true }
      );
    }, 1000 * 60);
  }
};

const updatePassword = async (req, res) => {
  const { email_ } = req.cookies;
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    await User.findOneAndUpdate(
      { email: email_ },
      {
        password: passwordHash,
      },
      { new: true }
    );

    res
      .cookie("email_", "", {
        expires: new Date(Date.now()),
      })
      .status(201)
      .json({
        success: true,
        message: "Password Updated Successfully",
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Bad Request",
    });
  }
};

export {
  registerNewUser,
  loginUser,
  getMyDetails,
  logoutUser,
  updateUserDetails,
  sendMail,
  sendOtp,
  verifyOtp,
  updatePassword,
};
