import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/otp.js';

const router = Router();

router.post('/otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
