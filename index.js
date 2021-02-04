const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

//Create the server
const app = express()

// Allow CORS

const corsOptions = {
    origin: process.env.FRONTEND_URL
}

app.use(cors(corsOptions))

//Connect to the database
connectDB()

//Allow read the req body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Create a public folder to share the files
app.use(express.static('uploads'))


//Routing
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/link', require('./routes/link'))
app.use('/api/file', require('./routes/file'))

// PORT app
const port = process.env.PORT || 4000

app.listen(port, '0.0.0.0', () => {
    console.log(`The server is listening on port: ${port}`)
})