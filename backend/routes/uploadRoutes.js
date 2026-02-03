const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        const prefix = file.mimetype.startsWith('audio/') ? 'audio-' : 'img-';
        cb(null, prefix + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 20000000 }, // Increased to 20MB for audio
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('images', 5); // Field name remains 'images' for compatibility but handles any filtered file

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp3|wav|webm|m4a|ogg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images or Audio only!');
    }
}

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.files == undefined || req.files.length === 0) {
                res.status(400).json({ message: 'No file selected' });
            } else {
                const filePaths = req.files.map(file => `/uploads/${file.filename}`);
                res.json({
                    message: 'Files uploaded!',
                    filePaths: filePaths
                });
            }
        }
    });
});

module.exports = router;
