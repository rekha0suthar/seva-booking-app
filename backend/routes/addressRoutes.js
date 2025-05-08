import express from 'express';
const router = express.Router();

// [GET] /address-by-pincode/:pincode
router.get('/address-by-pincode/:pincode', (req, res) => {
  const pin = req.params.pincode;
  // Simulated static data, replace with India Post API if needed
  const data = {
    110001: { city: 'New Delhi', state: 'Delhi' },
    400001: { city: 'Mumbai', state: 'Maharashtra' },
  };
  const location = data[pin];
  if (location) return res.json(location);
  res.status(404).json({ error: 'Invalid pincode' });
});
export default router;
