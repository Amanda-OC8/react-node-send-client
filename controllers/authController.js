const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const { validationResult } = require('express-validator')

exports.logUser = async (req, res, next) => {

    // Error Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Check if the user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email })
 

    if (!user) {
        res.status(401).json({ msg: 'The user not exist' })
        return next();
    }

    // Check the pwd and log the user

    if (bcrypt.compareSync(password, user.password)) {
        // Create JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: '8h'
        });
        res.json({ token })

    } else {
        res.status(400).json({ msg: 'Wrong password' })
        return next();
    }


}

exports.userAuth = (req, res, next) => {
    res.json({ user: req.user })
}