import User from '../models/User.js';

const checkUser = async (req, res) => {
  const user = await User.findOne({ contact: req.query.contact });
  res.json({ exists: !!user });
};

const addUser = async (req, res) => {
  const { contact, name, email } = req.body;
  try {
    let user = await User.findOne({ contact });

    if (!user) {
      user = await User.create({ contact, name, email });
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save(); //  update the user
    }

    res.status(201).json(user._id);
  } catch (err) {
    console.error('User creation error:', err.message);
    res.status(400).json({ error: 'User creation failed' });
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export { checkUser, addUser, getUser };
