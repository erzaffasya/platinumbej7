const multer = require('multer');
const path = require("path");

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

module.exports = upload;