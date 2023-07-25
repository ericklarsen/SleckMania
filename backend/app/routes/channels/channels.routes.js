const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/channel/channel.controller");
const { verifyAdminMember } = require("../../middlewares/verifyMemberPermission");
const imageUpload = require("../../middlewares/imageUpload");
const {
    verifyMyCompanyChannelAndDoIHaveTheAccess,
    verifyMyChannelAndDoIHaveTheAccessAsAdmin,
} = require("../../utilities");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/channels/getAllChannel", [authJwt.verifyToken], controller.getAllChannel);
    app.get("/api/channels/getMyChannel", [authJwt.verifyToken], controller.getMyChannel);
    app.post(
        "/api/channels/add",
        [imageUpload.single("channel_logo"), authJwt.verifyToken, verifyAdminMember],
        controller.add
    );
    app.post(
        "/api/channels/join",
        [authJwt.verifyToken, verifyMyCompanyChannelAndDoIHaveTheAccess],
        controller.join
    );
    app.post(
        "/api/channels/update",
        [authJwt.verifyToken, verifyMyChannelAndDoIHaveTheAccessAsAdmin],
        controller.update
    );
    app.post(
        "/api/channels/delete",
        [authJwt.verifyToken, verifyMyChannelAndDoIHaveTheAccessAsAdmin],
        controller.delete
    );
    app.post("/api/channels/getMembers", [authJwt.verifyToken], controller.getMembers);
    app.post("/api/channels/getRooms", [authJwt.verifyToken], controller.getRooms);
};
