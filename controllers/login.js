const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  console.log(user)
  const correctPassword = user === null ? false
    : bcrypt.compare(password, user.passwordHash)
  if (!correctPassword) return res.status(401).send({ error: 'wrong password or username' })

  const userForToken = {
    username: user.username,
    id: user._id

  }
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 3600 })
  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter