const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/assets/assets.controller");
const imageUpload = require("../../middlewares/imageUpload");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    // app.get("/assets/:filename", [authJwt.verifyToken], controller.get);
    app.get("/assets/:folder/:filename", controller.get);
    app.post("/assets", [imageUpload.single("image")], controller.upload);
};
