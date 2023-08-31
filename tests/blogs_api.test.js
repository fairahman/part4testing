const mongoose = require('mongoose')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    const blogObj = new Blog(blog)
    await blogObj.save()
  }
})
describe('when there is initially some blogs saved', () => {
  test('returns correct number of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    expect(response.body).toHaveLength(1)
  })

  test('blogs have id property', async () => {
    const response = await api
      .get('/api/blogs')
    for (let blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogs = await Blog.find({})
     console.log(blogs)
    const id = blogs[0].id
    const response = await api
      .get(`/api/blogs/${id}`)
      .expect(200)
    console.log(response.body)
    expect(response.body.title).toBe(blogs[0].title)
  })

  test('fails with status code 404 when valid non existing id is passed', async () => {
    const blogs = await Blog.find({})
    const id = blogs[0].id
    console.log('id', id)
    console.log(typeof id)
    await Blog.findByIdAndDelete(id)
    await api
      .get(`/api/blogs/${id}`)
      .expect(404)
  })

  test('fails with status code 400 when invalid id is passed', async () => {
    const invalidId = 3
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)

  })
})
describe('addition of a new blog', () => {
  const user = {
    "username": "mrUnchained",
    "name": "biscuitOliva",
    "password": "weirdniga"
  }
  const newBlog = {
    "title": "unchainedChronicles",
    "url": "blogs.com",
    "author": "biscuitOliva"

  }
  test('fails when token is missing', async () => {
    const newBlog = {
      author: 'pigeon',
      title: 'sky dreams',
      url: 'blogs.com',
      likes: 0
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    expect(response.body.error).toBe('jwt must be provided')
  })

  test('likes property defaults to 0 when it is missing in request', async () => {

    const blog = {
      title: 'Bleached',
      author: 'Whoknows',
      url: 'blog.com',
    }
    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)

    expect(response.body.likes).toBe(0)

  })

  test('returns "400 bad request" if title or url is missing from request/blog', async () => {
    const blog = {
      title: 'pokemon',
      author: 'janina',
      likes: 50000
    }
    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
  })

  test('succeeds when a valid blog data and token is provided', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)

    expect(loginResponse.body.token).toBeDefined()

    const token = loginResponse.body.token
    const blogCreatingResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
    console.log(blogCreatingResponse.body)
    expect(blogCreatingResponse.body).toMatchObject(newBlog)

    const latestBlogs = await Blog.find({})
    const blogTitles = latestBlogs.map(blog => blog.title)
    expect(blogTitles).toContain(blogCreatingResponse.body.title)
    expect(latestBlogs).toHaveLength(helper.initialBlogs.length + 1)

  })

})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const allBlogs = await Blog.find({})

    await api
      .delete(`/api/blogs/${allBlogs[0].id}`)
      .expect(204)
    const remainingBlogs = await Blog.find({})
    expect(remainingBlogs).not.toContainEqual(allBlogs[0])
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 3
    const response = await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
    console.log(response.body)
    expect(response.body).toEqual({ 'error': 'malformatted id' })
  })

  test('fails with status code 404 if valid formatted id is given but blog is not found', async() => {
    const blogs = await Blog.find({})
    const validId = blogs[0].id

    console.log('validId:', validId)
    await api
      .delete(`/api/blogs/${validId}`)

    await api
      .delete(`/api/blogs/${validId}`)
      .expect(404)
  })

})

describe('updating a blog', () => {

  test('succeeds with status code 200 when valid data is passed', async () => {
    const blog = {
      title: 'beyblade',
      author: 'kanima',
      likes: 0,
      url: 'blogs.com'
    }
    const blogs = await Blog.find({})
    const id = blogs[0].id
    const response = await api
      .put(`/api/blogs/${id}`)
      .send(blog)
      .expect(200)
    expect(response.body).toMatchObject({
      title: 'beyblade',
      author: 'kanima',
      url: 'blogs.com',
      likes: 0
    })
  })
  test('fails with status 404 if valid nonexistent id is passed', async () => {
    const id = 3
    await api
      .put(`/api/blogs/${id}`)
      .send({ url:'none.com' })
      .expect(404)

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})