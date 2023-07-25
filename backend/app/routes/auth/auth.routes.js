const { verifySignUp, authJwt } = require("../../middlewares");
const controller = require("../../controllers/auth/auth.controller");
const imageUpload = require("../../middlewares/imageUpload");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post(
        "/api/auth/register",
        [imageUpload.single("company_logo"), verifySignUp.checkDuplicateUsernameOrEmail],
        controller.register
    );

    app.post("/api/auth/login", controller.login);
    app.get("/api/auth/logout", [authJwt.verifyToken], controller.logout);
};
