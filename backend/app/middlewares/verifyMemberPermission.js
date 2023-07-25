const db = require("../models");
const { responseTemplate } = require(".");

const verifySuperMember = (req, res, next) => {
    if (req.company_permission_state === 3) {
        next();
        return;
    }

    res.status(200).send(responseTemplate("error", "You're not super user from this company."));
    // db("company_members")
    //     .where("user_uid", req.user_uid)
    //     .andWhere("permission_state", 3)
    //     .then((data) => {
    //         console.log("Verify Super Member");
    //         console.log(data);
    //         if (data.length) {
    //             const doesExist = data.filter((fil) => fil.company_uid === req.body.company_uid);
    //             if (doesExist.length) {
    //                 console.log("You're super member");
    //                 next();
    //                 return;
    //             }
    //         }
    //         console.log("You're not super member");
    //         res.status(200).send(
    //             responseTemplate("error", "You're not super user from this company.")
    //         );
    //     })
    //     .catch(() => {
    //         res.status(200).send(responseTemplate("error", "You're not super member."));
    //     });
};

const verifyAdminMember = (req, res, next) => {
    if (req.company_permission_state >= 2) {
        next();
        return;
    }

    res.status(200).send(responseTemplate("error", "You're not admin from this company."));
};

const memberPermission = {
    verifySuperMember,
    verifyAdminMember,
};

module.exports = memberPermission;
