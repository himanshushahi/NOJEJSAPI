import User from "../models/user.js";
import bcrypt from "bcrypt";


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
      req.session.email = email;
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
  if (!req.session.email) {
    return res.json({
      success: false,
      message: 'Login First',
    });
  }

  const data = await User.findOne({ email: req.session.email });

  res.json({
    success: true,
    info: {
      name: data.name,
      email: data.email,
      city: data.city,
      pin: data.pin,
      age: data.age,
    },
  });
};


const logoutUser = async (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
    message: 'Logout Successful',
  });
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
