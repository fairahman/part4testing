const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const unknownroute = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (err, req, res, next) => {
  console.log('error name:', err.name)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: 'missing title or url' })
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: err.message })
  }

}

const tokenExtractor = (req, res, next) => {
  const authorization = req.headers.authorization
  if (authorization) {
    if (authorization.startsWith('Bearer ')) {
      req.token =  authorization.replace('Bearer ', '')
      return next()
    }
  }
  req.token = null
  return next()
}

const userExtractor = async (req, res, next) => {
  try {
    const token = req.token
    console.log('token at userExtractor:', token)
    if (token) {
      const decodedToken = jwt.verify(token, config.SECRET)
      console.log('decodedToken', decodedToken)
      const id = decodedToken.id
      const user = await User.findById(id)
      req.user = user
      next()
    }
    res.status(400).send({ error: 'missing token' })
  }
  catch(err) {
    next(err)
  }
}
module.exports = {
  unknownroute,
  errorHandler,
  tokenExtractor,
  userExtractor
}