const User = require('../models/User')
const bcrypt = require('bcryptjs')
const shortid = require('shortid')
require('dotenv').config({ path: '.env' })
const { validationResult } = require('express-validator')
const Link = require('../models/Link')

exports.newLink = async (req, res, next) => {
    //Check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Create the link

    const { originalName, name } = req.body

    const link = new Link()

    link.url = shortid.generate()
    link.name = name
    link.originalName = originalName
    
    if (req.user) {
        const {password, downloads} = req.body
        
        if (downloads) {
            link.downloads = downloads
        }

        if (password) {
            const salt = await bcrypt.genSalt(10)
            link.password = await bcrypt.hash(password, salt)
        }

        link.owner = req.user.id
    }

    //Save on the database
    try {
        await link.save()
        res.json({ msg: `${link.url}` })
        return next()
    } catch (error){
        console.log(`There was an error: ${error}`)
    }
}

exports.allLinks = async (req, res) => {
    try {
        const allLinks = await Link.find({}).select('url -_id')
        res.json({allLinks})
    } catch (error){
        console.log(`There was an error: ${error}`)
    }
}

//Check if the file has a password
exports.privatePassword = async (req, res, next) => {
    const { url } = req.params

    //Verify if the url exists
    const link = await Link.findOne({ url })

    if (!link) {
        res.status(404).json({ msg: "The link doesn't exist" })
        return next()
    }
    
    if (link.password) {
        return res.json({password: true, link: link.url})
    }
    next()
}

exports.verifyPassword = async (req, res, next) => {
    const { url } = req.params
    const { password } = req.body 

    const link = await Link.findOne({ url })

    if (bcrypt.compareSync(password, link.password)) {
        next()
    } else {
        return res.status(401).json({ msg:'Wrong Password'})
    }

}

exports.getLinkFile = async (req, res, next) => {

    const { url } = req.params

    //Verify if the url exists
    const link = await Link.findOne({ url })

    if (!link) {
        res.status(404).json({ msg: "The link doesn't exist" })
        return next()
    }
    res.json({ file: link.name, password: false })
    next()
}