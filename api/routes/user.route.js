import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser); //to update or edit info in profile, userId(signin id) is taken as to which user we have to edit, for that updateUser function is imported

export default router;