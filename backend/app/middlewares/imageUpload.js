const multer = require("multer");
const multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
    }

    cb(null, true);
};
const multerStorage = multer.memoryStorage();
const imageUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

module.exports = imageUpload;
