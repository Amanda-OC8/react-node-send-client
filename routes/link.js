const express = require('express')
const router = express.Router()
const linkController = require('../controllers/linkController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


router.post('/',
    [
        check('name', 'Your file needs a name').not().isEmpty(),
        check('originalName', 'Uplaod a file').not().isEmpty()
    ], 
    auth,
    linkController.newLink
)

router.get('/', linkController.allLinks)

router.get('/:url', linkController.privatePassword, linkController.getLinkFile)

router.post('/:url', linkController.verifyPassword, linkController.getLinkFile)



module.exports = router