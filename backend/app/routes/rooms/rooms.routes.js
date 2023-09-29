const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/rooms/rooms.controller");
const imageUpload = require("../../middlewares/imageUpload");
const {
    verifyMyCompanyChannelAndDoIHaveTheAccess,
    verifyMyCompanyRoomAndDoIHaveTheAccess,
} = require("../../utilities");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post("/api/rooms/get", [authJwt.verifyToken], controller.get);
    app.post("/api/rooms/getDetails", [authJwt.verifyToken], controller.getDetails);
    app.post(
        "/api/rooms/add",
        [
            imageUpload.single("room_logo"),
            authJwt.verifyToken,
            verifyMyCompanyChannelAndDoIHaveTheAccess,
        ],
        controller.add
    );
    app.post(
        "/api/rooms/update",
        [
            imageUpload.single("room_logo"),
            authJwt.verifyToken,
            verifyMyCompanyRoomAndDoIHaveTheAccess,
        ],
        controller.update
    );
    app.post(
        "/api/rooms/delete",
        [authJwt.verifyToken, verifyMyCompanyRoomAndDoIHaveTheAccess],
        controller.delete
    );
};
