import express from 'express';
import Address from '../models/Address.js';
import { addAddress, getAddressByPin } from '../controllers/address.js';
const router = express.Router();

// [GET] /address-by-pincode/:pincode
router.get('/address-by-pincode/:pincode', getAddressByPin);

// [POST] /api/address - Save new address
router.post('/address', addAddress);

export default router;
