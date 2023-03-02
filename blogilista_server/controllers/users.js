const bcrypt = require('bcrypt');
const User = require('../models/user');
const usersRouter = require('express').Router();

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 });
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password === undefined) {
    return response.status(400).json({ error: 'password not set' });
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password too short' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  try {
    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch {
    response.status(400).end();
  }
});

module.exports = usersRouter;
