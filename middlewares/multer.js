const multer = require('multer')
const path = require('path')
const { CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

/*
Multer configuration for local storage::

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname)
        const fileName = file.originalname + '_' + Date.now() + extension
        cb(null, fileName)
    }
});
*/

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'myDrive',
        allowed_formats: ['jpg', 'png', 'gif'],
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error('Only Images & Gifs are allowed'), false)
    }
}

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { limits: 10 * 1024 * 1024 }
})

module.exports = uploads;