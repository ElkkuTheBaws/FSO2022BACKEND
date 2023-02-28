const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  if (typeof blog.url === 'undefined' || typeof blog.title === 'undefined') {
    response.status(400).json(blog);
  } else {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch {
    response.status(400).end();
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const updatedBlog = {
    likes: body.likes
  };

  try {
    const res = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });
    response.status(201).json(res);
  } catch {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
