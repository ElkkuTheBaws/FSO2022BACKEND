const User = require('../models/user');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('create user with new username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ElkkuTheBaws',
      name: 'Eelis Koivusaari',
      password: 'salainen'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

describe('when something wrong is inputed', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('Username too short', async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ee',
      name: 'Eelis Koivusaari',
      password: 'salainen'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('Username not set', async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Eelis Koivusaari',
      password: 'salainen'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('Same username two times', async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ElkkuTheBaws',
      name: 'Eelis Koivusaari',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('password not set', async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Elias',
      name: 'Eelis Koivusaari'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });

  test('password too short', async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Elias',
      name: 'Eelis Koivusaari',
      password: 'as'
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);
  });
});
