const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./helper')
const mongoose = require('mongoose')
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash =  await bcrypt.hash('jackcena', 10)
    const newUser = new User({
      username: 'rocky',
      passwordHash,
      new: 'jacky'
    })
    await newUser.save()
  })
  test('creation of a user succeeds with a unique username', async () => {
    const startingUsers = await helper.usersInDb()
    console.log('startingUsers:', startingUsers)
    const newUser = {
      username: 'alladin123',
      password: '123',
      name: 'alladin'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endUsers = await helper.usersInDb()
    expect(endUsers).toHaveLength(startingUsers.length + 1)
    const userNames = endUsers.map(user => user.username)
    expect(userNames).toContain(newUser.username)
  })
  test('creation of a user fails with status code 400 if username is not provided', async () => {
    const newUserWithoutUsername = {
      name: 'liton',
      password: 'lit-on'
    }
    const response = await api
      .post('/api/users')
      .send(newUserWithoutUsername)
      .expect(400)
    expect(response.body.error).toBe('missing username')
  })

  test('creation of user fails with status code 400 if password is not provided', async () => {
    const newUserWithoutPassword = {
      name: 'liton',
      username: 'lettin'
    }
    const response = await api
      .post('/api/users')
      .send(newUserWithoutPassword)
      .expect(400)
    expect(response.body.error).toBe('password too short or missing')
  })
})

 afterAll  = async () => {
  mongoose.connection.close()
}