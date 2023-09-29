const db = require("../models");
const { responseTemplate } = require(".");

const verifySuperUser = (req, res, next) => {
    db("users")
        .where("uid", req.user_uid)
        .andWhere("permission_state", 2)
        .then((data) => {
            if (data.length) {
                console.log("You're super User");
                next();
                return;
            }
            console.log("You're not super User");
            res.status(200).send(responseTemplate("error", "You're not super user"));
        })
        .catch(() => {
            res.status(200).send(responseTemplate("error", "You're not super User."));
        });
};

const verifyNormalUser = (req, res, next) => {
    db("users")
        .where("uid", req.user_uid)
        .andWhere("permission_state", 1)
        .then((data) => {
            if (data.length) {
                console.log("You're admin User");
                next();
                return;
            }
            console.log("You're not admin User");
            res.status(200).send(responseTemplate("error", "You're not admin user"));
        })
        .catch(() => {
            res.status(200).send(responseTemplate("error", "You're not admin User."));
        });
};

const userPermission = {
    verifySuperUser,
    verifyNormalUser,
};

module.exports = userPermission;
