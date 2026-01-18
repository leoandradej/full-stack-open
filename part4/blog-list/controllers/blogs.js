const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: [],
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  await savedBlog.populate('user', { username: 1, name: 1 });

  response.status(201).json(savedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body;

  if (!comment || comment.trim() === '')
    return response.status(400).json({ error: 'comment content is required' });

  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).json({ error: 'blog not found' });

  blog.comments = blog.comments.concat(comment);
  const updatedBlog = await blog.save();
  await updatedBlog.populate('user', { username: 1, name: 1 });

  response.status(201).json(updatedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) return response.status(404).json({ error: 'blog not found' });

    if (blog.user.toString() !== user._id.toString())
      return response
        .status(403)
        .json({ error: 'only the creator can delete this blog' });

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  await updatedBlog.populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
