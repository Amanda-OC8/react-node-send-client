const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const path = require('path')
const Link = require('../models/Link')

exports.uploadFile = async (req, res) => {

    //Multer configuration
    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
        
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }

    // Upload files using multer
    const upload = multer(multerConfig).single('file')

    upload(req, res, async (error) => {
       
        if (!error) {
            res.json({ file: req.file.filename })
        } else {
            console.log(error)
            return next()
        }
    })
}

exports.downloadFile = async (req, res, next) => {
    const {file} = req.params
    //Get the link
    const link = await Link.findOne({name: file})

    const donwloadFile = path.resolve(__dirname, '..', 'uploads', `${file}`)
    res.download(donwloadFile)

    //Delete the file from server and database
    // When downloads are 1, the file must be deleted
    const { downloads, name } = link

    if (downloads > 1) {
        link.downloads--
        await link.save()
    } else {
        // Delete the file
        req.file = name
     
        //Delete the file from the db
        await Link.findOneAndDelete(link.id)

        next()
    }
}


exports.deleteFile = async (req, res, next) => {
    
    try { 
        fs.unlinkSync(path.resolve(__dirname, '..', 'uploads', `${req.file}`));
    } catch (error){
        console.log(`There was an error: ${error}`)
    }
}
