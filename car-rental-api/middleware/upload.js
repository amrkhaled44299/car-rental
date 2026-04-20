const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/misc';
    if (file.fieldname === 'profile_image')        folder = 'uploads/profiles';
    else if (file.fieldname === 'car_images')       folder = 'uploads/cars';
    else if (file.fieldname.includes('image'))      folder = 'uploads/licenses';
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase());
  ok ? cb(null, true) : cb(new Error('Images only'), false);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5*1024*1024 } });