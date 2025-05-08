import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// [GET] /users/identity-exist?contact=number
router.get('/identity-exist', async (req, res) => {
  const user = await User.findOne({ contact: req.query.contact });
  res.json({ exists: !!user });
});

// [POST] /users
router.post('/', async (req, res) => {
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

    res.status(201).json(user);
  } catch (err) {
    console.error('User creation error:', err.message);
    res.status(400).json({ error: 'User creation failed' });
  }
});

// [GET] /users/:id
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

export default router;
