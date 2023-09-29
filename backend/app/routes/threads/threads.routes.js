const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/threads/threads.controller");
const {
    verifyMyCompanyChannelAndDoIHaveTheAccess,
    verifyMyThreadAndDoIHaveTheAccess,
} = require("../../utilities");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post(
        "/api/threads/get",
        [authJwt.verifyToken, verifyMyCompanyChannelAndDoIHaveTheAccess],
        controller.get
    );
    app.post(
        "/api/threads/add",
        [authJwt.verifyToken, verifyMyCompanyChannelAndDoIHaveTheAccess],
        controller.add
    );
    app.post(
        "/api/threads/update",
        [authJwt.verifyToken, verifyMyThreadAndDoIHaveTheAccess],
        controller.update
    );
    app.post(
        "/api/threads/delete",
        [authJwt.verifyToken, verifyMyThreadAndDoIHaveTheAccess],
        controller.delete
    );
};
