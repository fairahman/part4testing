const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'naruto stories',
    author: 'jibikawa',
    url: 'blogs.com',
    likes: 64
  },
  {
    title: 'naruto stories',
    author: 'reishu',
    url: 'blogs.com',
    likes: 60
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}
const usersInDb = async () => {
  const users = await User.find({})
  return users
}
module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}