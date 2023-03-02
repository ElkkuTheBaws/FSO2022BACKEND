const User = require('../models/user');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};
const createUser = async (api, testUser) => {
  await api
    .post('/api/users')
    .send(testUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);
};
module.exports = {
  usersInDb,
  createUser
};
