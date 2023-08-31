const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res, next) => {
  try {
    let users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    console.log(users)
    users = users.map(user => ({ name: user.name, username: user.username, id: user._id, blogs: user.blogs }))
    res.status(200).json(users)
  }
  catch(error) {
    console.log('error at getting users:', error )
    next(error)
  }
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, password, name } = req.body
    if ( !password || password.length < 3)
      return res.status(400).json({ error: 'password too short or missing' })
    else if (!username)
      return res.status(400).json({ error: 'missing username' })
    const passwordHash = await bcrypt.hash(password, 10)
    console.log('passwordHash', passwordHash)
    const user = new User ({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }
  catch(error) {
    console.log('err at creating users:', error)
    next(error)
  }
})

module.exports = usersRouter