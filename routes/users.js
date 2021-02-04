const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

//Create an user

router.post('/', [
        check('name', 'The name is mandatory').not().isEmpty(),
        check('email', 'The email is mandatory and valid').isEmail(),
        check('password', 'The password must have 6 chacarters').isLength({ min: 6 })
    ],
    userController.newUser
)

module.exports = router