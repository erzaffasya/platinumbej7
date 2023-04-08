require('dotenv').config();
const multer = require('multer');
const path = require("path");
const cloudinary = require('cloudinary').v2
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
},
});

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});

async function uploadCloudinary(filepath) {
  let res;
  try {
    res = await cloudinary.uploader.upload(filepath, {
      use_filename: true
    });

    fs.unlinkSync(filepath);
    return res.url;
  } catch (error) {
    fs.unlinkSync(filepath);
    return e;
  }
}

module.exports = {
  upload,
  uploadCloudinary
};