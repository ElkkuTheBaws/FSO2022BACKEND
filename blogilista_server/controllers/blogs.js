const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  console.log(request.user);
  const blog = new Blog(request.body);
  blog.user = request.user._id;

  if (typeof blog.url === 'undefined' || typeof blog.title === 'undefined') {
    response.status(400).json(blog);
  } else {
    const savedBlog = await blog.save();
    request.user.blogs = request.user.blogs.concat(savedBlog._id);
    await request.user.save();

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() === request.user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: 'This user has no ownership over this blog' });
    }
  } catch {
    response.status(400).json({ error: 'blog not found' });
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
// middleware 4.19:
