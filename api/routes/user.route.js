import express from "express";
import { deleteUser, getUser, getUsers, signout, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser); //to update or edit info in profile, userId(signin id) is taken as to which user we have to edit, for that updateUser function is imported
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;