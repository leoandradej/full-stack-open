const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash,
    });

    const savedUser = await user.save();
    userId = savedUser._id.toString();

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' });

    token = loginResponse.body.token;

    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: userId,
    }));

    await Blog.insertMany(blogsWithUser);
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((e) => e.title);
    assert(titles.includes('Canonical string reduction'));
  });

  describe('viewing a specific blog', () => {
    test('success with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(resultBlog.body.title, blogToView.title);
      assert.strictEqual(resultBlog.body.author, blogToView.author);
      assert.strictEqual(resultBlog.body.url, blogToView.url);
      assert.strictEqual(resultBlog.body.likes, blogToView.likes);
      assert.strictEqual(resultBlog.body.id, blogToView.id);
    });

    test('fails with status code 404 id blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new blog', () => {
    test('success with valid data and token', async () => {
      const newBlog = {
        title: 'How to do unit tests in node',
        author: 'Josh Smith',
        url: 'http://somefakeurl.com/blahblahblah',
        likes: 11,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes('How to do unit tests in node'));
    });

    test('fails with status 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Blog without token',
        author: 'Josh Smith',
        url: 'http://somefakeurl.com/haslalsaln',
        likes: 5,
      };

      const result = await api.post('/api/blogs').send(newBlog).expect(401);

      assert(result.body.error.includes('token'));

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with status code 401 if token is invalid', async () => {
      const newBlog = {
        title: 'Blog without token',
        author: 'Josh Smith',
        url: 'http://somefakeurl.com/haslalsaln',
        likes: 5,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalidtoken123')
        .send(newBlog)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with status code 400 if data is invalid', async () => {
      const newBlog = {
        title: 'A Blog about life',
        url: 'http://somefakeurl.com/blahblahblah',
        likes: 0,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('succeeds and set "likes" to 0 if its missing', async () => {
      const newBlog = {
        title: 'A Blog about life',
        author: 'Josh Smith',
        url: 'http://somefakeurl.com/blahblahblah',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if user is the creator', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with status code 403 if use is not the creator', async () => {
      const passwordHash = await bcrypt.hash('otherpassword', 10);
      const otherUser = new User({
        username: 'otheruser',
        name: 'Other User',
        passwordHash,
      });

      await otherUser.save();

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'otheruser', password: 'otherpassword' });

      const otherToken = loginResponse.body.token;

      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe('updating a blog', () => {
    test('succeeds if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      blogToUpdate.title = 'New Title';

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes('New Title'));
    });
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany();

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(
      result.body.error.includes('username must be at least 3 characters long')
    );

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'validusername',
      name: 'Short Password',
      password: 'ab',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(
      result.body.error.includes('password must be at least 3 characters long')
    );

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password missing', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'validusername',
      name: 'No Password',
      // password missing
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('password is required'));

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
