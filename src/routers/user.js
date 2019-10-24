const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const auth = require('../middleware/auth')
const fetch = require('node-fetch')
const validator = require('validator')

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



/**
 * Update the password. Payload must be of form:
 *
 * {
 *   "currentPassword": "tHeCuRrEnToNe",
 *   "newPassword": "tHeNeWoNe"
 * }
 */
router.put('/users/me/password', auth, async(req, res) => {

  try {
    let user = req.user
    const isPasswordMatch = await bcrypt.compare(req.body.currentPassword, user.password)

    if (!isPasswordMatch) {
      throw new Error('The current password is invalid')
    }

    await user.updateField('password', req.body.newPassword)
    res.status(201).send(user)
  } catch (error) {
    console.log(error);
    res.status(400).send({error: error.toString()})
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
    await user.updateField('email', req.body.email)
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})


/**
 * update the link field
 * The payload should be:
 * {
 *   "link": "http://example.com"
 * }
 */
router.put('/users/me/link', auth, async (req, res) => {
  try {
    let user = req.user
    let link = req.body.link
    await user.updateField('link', link)
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
    await user.updateField('description', req.body.description)
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
    await user.updateField('picture', req.body.picture)
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})



module.exports = router
