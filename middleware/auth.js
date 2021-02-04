const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

module.exports = (req, res, next) => {
    
    const authHeader = req.get('Authorization')
    
    if (authHeader) {
        // Get the Token 
        const token = authHeader.split(' ')[1]
        
        if (token) {
            // Check el JWT
            try {
                const user = jwt.verify(token, process.env.SECRET)
                req.user = user
            } catch (error) {
                console.log(`JWT incorrect. Error: ${error}`)
            }
        }

    }
    return next()
}