import express from 'express';
import User from '../models/User.js';
import { addUser, checkUser, getUser } from '../controllers/user.js';
// import { sendOtp, verifyOtp } from '../controllers/otp.js';

const router = express.Router();

// [GET] /users/identity-exist?contact=number
router.get('/identity-exist', checkUser);

// [POST] /users
router.post('/', addUser);

// [GET] /users/:id
router.get('/:id', getUser);

// router.post('/otp', sendOtp)
// router.post('/verify-otp', verifyOtp)

export default router;
