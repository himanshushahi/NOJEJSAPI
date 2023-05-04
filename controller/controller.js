import User from "../models/user.js";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

const registerNewUser = async (req, res) => {
  const { name, email, password,age,city,pin } = req.body;
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
        pin
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
      // Generate JWT token
      const token = jwt.sign({ email: email }, process.env.COOKIE_SECRET);
      res.cookie("jwtoken", token, {
        httpOnly: true,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      });

      res.status(200).json({
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
  const token = req.cookies;
console.log(token)
  if (token.jwtoken === undefined) {
    return res.json({
      success: false,
      message: "Login First",
    });
  } else {
    const decoded = jwt.verify(token.jwtoken, process.env.COOKIE_SECRET);
    const data = await User.findOne({ email: decoded.email });
    res.json({
      success:true,
      info:{
        name:data.name,
        email:data.email,
        city:data.city,
        pin:data.pin,
        age:data.age
      }
    });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwtoken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "Development" ? false : true,
    });
    res.json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.json({
      success:false,
      message:"internal server error"
    })
  }
  
};

const updateUserDetails = async(req,res)=>{
  try {
    const {_id} = req.user;
   const {name,age,city,pin} = req.body;
   const user = await User.findByIdAndUpdate(_id,{
    name,
    age,
    city,
    pin
   },{new:true})
   if(user){
    res.status(200).json({
      success:true,
      message:"Information Updated Successfully",
      user
    })
   }
  } catch (error) {
    res.json({
      success:false,
      message:"Some error with updating the data"
    })
  }
   
   
}

export {
  registerNewUser,
  loginUser,
  getMyDetails,
  logoutUser,
  updateUserDetails
};
