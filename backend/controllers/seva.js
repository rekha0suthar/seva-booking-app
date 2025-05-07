import Seva from '../models/Seva.js';

// Method to fetch all sevas
const getSevas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;
    const total = await Seva.countDocuments();
    const sevas = await Seva.find().skip(skip).limit(limit);
    res.status(200).json({
      sevas,
      page,
      totalPages: Math.ceil(total / limit),
      totalSevas: total,
    });
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
