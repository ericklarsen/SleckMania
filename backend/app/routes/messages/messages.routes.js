const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/messages/messages.controller");
const {
    verifyMyRoomMessagesAndDoIHaveTheAccess,
    verifyMyMessageAndDoIHaveTheAccess,
} = require("../../utilities");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post(
        "/api/messages/getAllMessagesRoom",
        [authJwt.verifyToken, verifyMyRoomMessagesAndDoIHaveTheAccess],
        controller.get
    );
    app.post(
        "/api/messages/add",
        [authJwt.verifyToken, verifyMyRoomMessagesAndDoIHaveTheAccess],
        controller.add
    );
    app.post(
        "/api/messages/update",
        [authJwt.verifyToken, verifyMyMessageAndDoIHaveTheAccess],
        controller.update
    );
    app.post(
        "/api/messages/delete",
        [authJwt.verifyToken, verifyMyMessageAndDoIHaveTheAccess],
        controller.delete
    );
};
