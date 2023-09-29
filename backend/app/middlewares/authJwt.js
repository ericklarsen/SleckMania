const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const { responseTemplate } = require(".");

verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(200).send({
            status: 0,
            data: "Unauthorized!",
        });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(200).send({
                status: 0,
                data: "Unauthorized!",
            });
        }

        try {
            db("users_token")
                .where({ user_uid: decoded.user_uid, token })
                .then(async (data) => {
                    if (!data.length) {
                        return res.status(200).send({
                            status: 0,
                            data: "Unauthorized!",
                        });
                    }

                    const userDetails = await db("users").where("uid", decoded.user_uid).first();
                    const companyDetails = await db("company_members")
                        .where("user_uid", decoded.user_uid)
                        .first();
                    req.user_uid = decoded.user_uid;
                    req.token = token;
                    req.permission_state = userDetails?.permission_state;
                    req.company_uid = companyDetails?.company_uid;
                    req.company_permission_state = companyDetails?.permission_state;
                    // console.log(req.user_uid);

                    next();
                });
        } catch (err) {
            res.status(200).send({
                status: 0,
                data: err.detail,
            });
        }
    });
};

const authJwt = {
    verifyToken: verifyToken,
};
module.exports = authJwt;
