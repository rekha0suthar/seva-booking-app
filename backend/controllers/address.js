import Address from '../models/Address.js';

const getAddressByPin = async (req, res) => {
  const pin = req.params.pincode;
  // Simulated static data, replace with India Post API if needed
  const data = {
    110001: { city: 'New Delhi', state: 'Delhi' },
    400001: { city: 'Mumbai', state: 'Maharashtra' },
  };
  const location = data[pin];
  if (location) return res.json(location);
  res.status(404).json({ error: 'Invalid pincode' });
};

const addAddress = async (req, res) => {
  const { userContact, type, addrLine1, addrLine2, pincode, city, state } =
    req.body;

  try {
    const address = await Address.create({
      userContact,
      type,
      addrLine1,
      addrLine2,
      pincode,
      city,
      state,
    });

    res.status(201).json({ message: 'Address saved', address });
  } catch (err) {
    console.error('Error saving address:', err.message);
    res.status(500).json({ error: 'Failed to save address' });
  }
};

export { getAddressByPin, addAddress };
