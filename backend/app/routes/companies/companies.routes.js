const { verifySignUp, authJwt } = require("../../middlewares");
const controller = require("../../controllers/companies/companies.controller");
const imageUpload = require("../../middlewares/imageUpload");
const { verifySuperMember } = require("../../middlewares/verifyMemberPermission");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/companies/get", [authJwt.verifyToken], controller.get);
    // app.post(
    //     "/api/companies/add",
    //     [authJwt.verifyToken, imageUpload.single("company_logo")],
    //     controller.add
    // );
    app.post(
        "/api/companies/addMembers",
        [authJwt.verifyToken, verifySuperMember],
        controller.addMembers
    );
    app.get("/api/companies/getAllMembers", [authJwt.verifyToken], controller.getAllMembers);
    app.post(
        "/api/companies/updateMembersPermissionState",
        [authJwt.verifyToken, verifySuperMember],
        controller.updateMembersPermissionState
    );
    app.post(
        "/api/companies/update",
        [imageUpload.single("company_logo"), authJwt.verifyToken, verifySuperMember],
        controller.update
    );
    app.post("/api/companies/delete", [authJwt.verifyToken], controller.delete);
};
