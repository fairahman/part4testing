require ('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'test' ?
  process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const PORT = process.env.PORT

const SECRET = process.env.SECRET
// console.log('MONGODB_URI', MONGODB_URI)
// console.log('Node_env', process.env.NODE_ENV)
module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}