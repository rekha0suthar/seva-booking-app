import Seva from '../models/Seva.js';

// Method to fetch all sevas
const getSevas = async (req, res) => {
  try {
    const sevas = await Seva.find();
    res.status(200).json(sevas);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Method to fetch specific seva for given code
const getSeva = async (req, res) => {
  try {
    const seva = await Seva.findOne({ code: req.params.code });

    seva
      ? res.status(200).json(seva)
      : res.status(404).json({ msg: 'Not found' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getSeva, getSevas };
