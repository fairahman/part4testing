const unknownroute = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (err, req, res, next) => {
  console.log("error name:", err.name)
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
module.exports = {
  unknownroute,
  errorHandler,
  tokenExtractor
}