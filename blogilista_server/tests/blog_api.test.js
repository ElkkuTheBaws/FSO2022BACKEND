const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
// const { MONGODB_URI } = require('../utils/config');

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Kalle Mätitahna',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 11
  },
  {
    title: 'Miten voitta Magnus Carlsen?',
    author: 'Hikaru',
    url: 'https://www.youtube.com/watch?v=RSQ-1ivehCs&ab_channel=GMHikaru',
    likes: 8
  },
  {
    title: 'Klassinen aloitusvirhe',
    author: 'Hikaru',
    url: 'https://www.youtube.com/watch?v=RSQ-1ivehCs&ab_channel=GMHikaru',
    likes: 4
  },
  {
    title: 'Kandista helppo vitonen',
    author: 'Mäkisen matti',
    url: 'https://www.google.com/'
  }

];

const testUser = {
  username: 'root',
  name: 'Test User',
  password: 'salainen'
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  for (let i = 0; i < initialBlogs.length; i++) {
    const blogObject = new Blog(initialBlogs[i]);
    await blogObject.save();
  }
});

const api = supertest(app);

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});
describe('Add blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = initialBlogs[0];

    await helper.createUser(api, testUser);

    const loginResponse =
     await api
       .post('/api/login')
       .send({ username: testUser.username, password: testUser.password })
       .expect(200);

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const contents = response.body.map(r => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(contents).toContain(initialBlogs[0].title);
  });

  test('adding blog without login', async () => {
    const newBlog = initialBlogs[0];

    await helper.createUser(api, testUser);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('adding blog with invalid user information', async () => {
    const newBlog = initialBlogs[0];

    await helper.createUser(api, testUser);

    const loginResponse =
     await api
       .post('/api/login')
       .send({ username: testUser.username, password: 'vaara' })
       .expect(401);

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(newBlog)
      .expect(401);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
  });
});

test('blog has defined id value', async () => {
  const response = await api.get('/api/blogs');

  for (let i = 0; i < response.body.length; i++) {
    expect(response.body[i].id).toBeDefined();
  }
});

test('all blogs have defined likes value that is atleast 0', async () => {
  const response = await api.get('/api/blogs');
  for (let i = 0; i < response.body.length; i++) {
    expect(response.body[i].likes).toBeDefined();
    expect(response.body[i].likes).toBeGreaterThanOrEqual(0);
  }
});
test('invalid blog gives statuscode bad request', async () => {
  const invalidBlogUrl = {
    title: 'Kandista helppo kolmonen',
    author: 'Mäkisen matti'
  };

  const invalidBlogTitle = {
    author: 'Mäkisen matti',
    url: 'www.googletin.net'
  };

  await helper.createUser(api, testUser);

  const loginResponse =
     await api
       .post('/api/login')
       .send({ username: testUser.username, password: testUser.password })
       .expect(200);

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + loginResponse.body.token)
    .send(invalidBlogUrl)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + loginResponse.body.token)
    .send(invalidBlogTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test('Add blog and delete it', async () => {
  const newBlog = initialBlogs[0];

  await helper.createUser(api, testUser);

  const loginResponse =
     await api
       .post('/api/login')
       .send({ username: testUser.username, password: testUser.password })
       .expect(200);

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + loginResponse.body.token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  let response = await api.get('/api/blogs');

  const contents = response.body.map(r => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain(initialBlogs[0].title);

  await api
    .delete(`/api/blogs/${response.body[response.body.length - 1].id}`)
    .expect(401);

  expect(response.body).toHaveLength(initialBlogs.length + 1);

  await api
    .delete(`/api/blogs/${response.body[response.body.length - 1].id}`)
    .set('Authorization', 'Bearer ' + loginResponse.body.token)
    .expect(204);

  response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('Update blog', async () => {
  let response = await api.get('/api/blogs');

  const updatedBlog = {
    likes: 15
  };

  await api
    .put(`/api/blogs/${response.body[0].id}`)
    .send(updatedBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  response = await api.get('/api/blogs');
  expect(response.body[0].likes).toBe(updatedBlog.likes);
});

afterAll(async () => {
  await mongoose.connection.close();
});
