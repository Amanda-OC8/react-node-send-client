const { mongo } = require('mongoose')

const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connectDB = async () => {
    const dbLocal = 'nodeserver'
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
            // useCreateIndex: true
        })
        console.log(`Connected succesfully to ${dbLocal}`)
    } catch (error){
        console.log(`There was an error: ${error}`)
        process.exit(1)
    }

}

module.exports =connectDB