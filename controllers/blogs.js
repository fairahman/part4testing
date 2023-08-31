const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  // function shuffleArray(array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]] // Swap elements
  //   }
  //   return array[Math.floor(Math.random() * array.length)]
  // }
  const getTokenFrom = (request) => {
    const authorization = request.headers.authorization
    console.log('authorization:', authorization)
    // console.log(authorization.trim().startsWith('bearer'))
    console.log(authorization.startsWith('Bearer '))
    if (authorization && authorization.startsWith('Bearer ')) {
      console.log('in heyaa')
      return authorization.replace('Bearer ', '')
    }
    return null
  }
  try {
    const { title, author, url } = request.body

    // const users = await User.find({})
    // const user = shuffleArray(users)
    // const userId = user._id
    const likes = request.body.likes !== undefined ? request.body.likes :  0
    const token = getTokenFrom(request)
    console.log(token)
    const decodedToken = jwt.verify(token, config.SECRET)
    console.log('decodedToken', decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }
    const user = await User.findById(decodedToken.id)
    console.log('user', user)
    const blog = new Blog({ title, author, likes, url, user: user.id })
    console.log('blogg:', blog)
    const savedBlog = await blog.save()
    user.blogs.push(savedBlog._id)
    console.log('updated user:', user)
    await user.save()
    // // console.log('updated user:', user)
    // return response.status(201).json(savedBlog)
    response.json(savedBlog)
  }
  catch(error) {
    console.log(error)
    next(error)
  }
})
blogsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const fetchedBlog = await Blog.findById(id)
    if (fetchedBlog) {
      return response.status(200).send(fetchedBlog)
    }
    else response.status(404).end()
  }
  catch(error) {
    next(error)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog  = await Blog.findByIdAndDelete(request.params.id)
    if (deletedBlog) {
      response.status(204).end()
      return
    }
    response.status(404).send({ error: 'blog not found' })
  }
  catch(error) {
    console.log('error:', error)
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  console.log(request.body)
  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
    if (updatedBlog) {
      response.status(200).json(updatedBlog)
      return
    }
    else return response.status(404).send({ error: 'blog not found' })
  }
  catch(error) {
    next(error)
  }

})

module.exports = blogsRouter