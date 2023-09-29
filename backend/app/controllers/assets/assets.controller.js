const db = require("../../models");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

exports.get = async (req, res) => {
    const { folder, filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, `assets/${folder}/` + filename);
    return res.sendFile(fullfilepath);
};

exports.upload = async (req, res) => {
    try {
        console.log(req.body.user_uid);
        // console.log(path.resolve());
        const file = req.file;
        if (!file) return next();

        const fileName = `${uuidv4()}-${Date.now()}.webp`;
        const resize = await sharp(req.file?.buffer)
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(`${path.resolve()}/assets/${fileName}`);

        console.log(resize);
        res.json("/image api");
    } catch (err) {
        console.log(err);
        res.status(400).json(JSON.stringify(err));
    }
};
