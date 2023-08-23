const unknownroute = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  unknownroute
}