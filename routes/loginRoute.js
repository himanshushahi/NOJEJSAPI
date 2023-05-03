import express from 'express';
import { getMyDetails, loginUser, logoutUser, registerNewUser,updateUserDetails } from '../controller/controller.js';
import { isAuthenticated } from '../middlewares/middleware.js';

const router = express.Router();

router.post("/signup",registerNewUser);
router.post("/login",loginUser);

router.get("/me",isAuthenticated,getMyDetails);
router.put("/me",isAuthenticated,updateUserDetails);

router.get("/logout",isAuthenticated,logoutUser);


export default router;