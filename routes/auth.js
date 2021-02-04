const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


router.post('/',
    [
        check('email', 'The email is mandatory and valid').isEmail(),
        check('password', 'The password must have 6 characters').isLength({ min: 6 })
    ],
    authController.logUser
)


router.get('/',
    auth,
    authController.userAuth
)


module.exports = router