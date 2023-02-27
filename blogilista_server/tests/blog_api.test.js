const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { MONGODB_URI } = require('../utils/config');

const api = supertest(app);
console.log(MONGODB_URI);
test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
