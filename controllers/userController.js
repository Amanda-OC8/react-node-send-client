const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

exports.newUser = async (req, res) => {
    
    // Check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    //Verify if is an unique user
    const {email, password} = req.body

    let user = await User.findOne({ email })
    
    if (user) {
        return res.status(400).json({ msg: 'The email is already register' });
    }

    //Create the user
    user = new User(req.body)

    // Hash the pwd
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    try {
        await user.save();
        res.json({ msg: 'User created' });
    } catch (error) {
        console.log(`There was a mistekae: ${error}`);
    }
    
}
