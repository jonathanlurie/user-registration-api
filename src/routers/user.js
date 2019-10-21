const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

/**
 * Create a new user, to which we add a token
 *
 * Requires a JSON payload:
 * {
 *   "username": "johnnybravo",
 *   "email": "qwerty@email.com",
 *   "password": "clear password"
 * }
 */
router.post('/users/create', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})


router.put('/users/me/password', auth, async(req, res) => {

  console.log(await bcrypt.hash(req.body.newPassword, 8))

    try {
      let user = req.user
      console.log('plain', req.body.currentPassword)
      console.log('hash', user.password)
      const isPasswordMatch = await bcrypt.compare(req.body.currentPassword, user.password)

      console.log('isPasswordMatch', isPasswordMatch)

      if (!isPasswordMatch) {
          throw new Error({error: 'The current password is invalid'})
      }

      user.password = await bcrypt.hash(req.body.newPassword, 8)
      user.save()
      res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})


/**
 * The token must be in the header
 */
router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})





router.post('/users/me/logout', auth, async (req, res) => {
  // here req.user is added byt the middleware from the database
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send() // should maybe send something back to the server
    } catch (error) {
        res.status(500).send(error)
    }
})


/**
 * update the email field
 * The payload should be:
 * {
 *   "email": "bla@email.com"
 * }
 */
router.put('/users/me/email', auth, async (req, res) => {
  try {
    let user = req.user
    user.email = req.body.email
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})


/**
 * update the description field
 * The payload should be:
 * {
 *   "description": "hello..."
 * }
 */
router.put('/users/me/description', auth, async (req, res) => {
  try {
    let user = req.user
    user.description = req.body.description
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})


/**
 * update the profile picture field
 * The payload should be:
 * {
 *   "picture": "hello..."
 * }
 */
router.put('/users/me/picture', auth, async (req, res) => {
  try {
    let user = req.user
    user.picture = req.body.picture
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})



router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send() // should maybe send something back to the server
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
