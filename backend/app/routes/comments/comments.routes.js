const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/comments/comments.controller");
const {
    verifyMyChannelThreadAndDoIHaveTheAccess,
    verifyMyCommentsAndDoIHaveTheAccess,
} = require("../../utilities");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post(
        "/api/comments/getAllCommentsThread",
        [authJwt.verifyToken, verifyMyChannelThreadAndDoIHaveTheAccess],
        controller.get
    );
    app.post(
        "/api/comments/add",
        [authJwt.verifyToken, verifyMyChannelThreadAndDoIHaveTheAccess],
        controller.add
    );
    app.post(
        "/api/comments/update",
        [authJwt.verifyToken, verifyMyCommentsAndDoIHaveTheAccess],
        controller.update
    );
    app.post(
        "/api/comments/delete",
        [authJwt.verifyToken, verifyMyCommentsAndDoIHaveTheAccess],
        controller.delete
    );
};
