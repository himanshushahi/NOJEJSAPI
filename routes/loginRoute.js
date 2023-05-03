import express from 'express';
import { getMyDetails, loginUser, logoutUser, registerNewUser } from '../controller/controller.js';
import { isAuthenticated } from '../middlewares/middleware.js';

const router = express.Router();

router.post("/new",registerNewUser);
router.post("/login",loginUser);

router.get("/me",isAuthenticated,getMyDetails);

router.get("/logout",isAuthenticated,logoutUser)


export default router;