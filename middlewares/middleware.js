import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies;
    if(token.jwtoken === undefined){
     return res.json({
       success:false,
       message:"Login First"
     })
     
    }else{
     const decoded = jwt.verify(token.jwtoken,process.env.COOKIE_SECRET)
     const data = await User.findOne({email:decoded.email})
     req.user = data;
     next();
    }
};
