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

module.exports = blogsRouter;
