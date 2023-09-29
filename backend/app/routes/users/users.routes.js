const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/users/users.controller");
const imageUpload = require("../../middlewares/imageUpload");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post(
        "/api/users/updateAvatar",
        [authJwt.verifyToken, imageUpload.single("image")],
        controller.updateAvatar
    );
    app.post("/api/users/updateDetails", [authJwt.verifyToken], controller.updateDetails);
    app.get("/api/users/getDetails", [authJwt.verifyToken], controller.getDetails);
};
