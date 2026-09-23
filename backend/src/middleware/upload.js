const multer = require('multer');
const path = require('path');
const fs = require('fs');

const avatarDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
const groupDir = path.join(__dirname, '..', '..', 'uploads', 'groups');
fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(groupDir, { recursive: true });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
  }
  cb(null, true);
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const groupStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, groupDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  },
});

const uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGroupAvatar = multer({ storage: groupStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadAvatar, uploadGroupAvatar };