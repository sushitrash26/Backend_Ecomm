import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatar,
  updateUserDetails,
  checkUniqueUsername,
  getCurrentUser
} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


//user's routes
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/update-details").post(verifyJWT, updateUserDetails);
router.route("/update-profile").post(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-password").post(verifyJWT, changePassword);
router.route("/unique/:username").get(checkUniqueUsername);
router.route("/get-current-user").get(verifyJWT,getCurrentUser);

export default router;
