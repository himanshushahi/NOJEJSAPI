import express from "express";
import {
  getMyDetails,
  loginUser,
  logoutUser,
  registerNewUser,
  updateUserDetails,
  sendMail
} from "../controller/controller.js";
import { isAuthenticated } from "../middlewares/middleware.js";

const router = express.Router();

router.post("/signup", registerNewUser).get((req, res) => {
    res.sendFile("public/register.html");
  });
router.post("/login", loginUser);

router.get("/me", isAuthenticated, getMyDetails);
router.put("/me", isAuthenticated, updateUserDetails);

router.get("/logout", isAuthenticated, logoutUser);
router.post("/mail",isAuthenticated,sendMail)

export default router;
