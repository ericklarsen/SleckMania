const db = require("../../models");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

exports.get = async (req, res) => {
    db.select()
        .from("companies")
        .orderBy("uid", "asc")
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

// exports.add = async (req, res) => {
//     const { company_name } = req.body;
//     const requiredFields = ["company_name"];

//     if (!validatorForRequest(res, req, requiredFields)) {
//         return;
//     }

//     try {
//         if (req.company_uid || req.permission_state === 1) {
//             res.status(200).send(responseTemplate("error", "You're not allowed."));
//             return;
//         }

//         const file = req.file;
//         if (!file) {
//             res.status(200).send(responseTemplate("error", "Please provide your company logo."));
//             return;
//         }

//         const fileName = `${uuidv4()}-${Date.now()}.webp`;
//         const resize = await sharp(req.file?.buffer)
//             .resize(800)
//             .toFormat("webp")
//             .webp({ quality: 90 })
//             .toFile(`${path.resolve()}/assets/companies/${fileName}`);

//         console.log(resize);

//         db("companies")
//             .insert({
//                 company_name,
//                 company_logo: fileName,
//             })
//             .returning("uid")
//             .then((data) => {
//                 db("company_members")
//                     .insert({
//                         company_uid: data[0].uid,
//                         user_uid: req.user_uid,
//                         permission_state: 3, // super member
//                     })
//                     .returning("uid")
//                     .then(() => {
//                         res.status(200).send(responseTemplate("success", "Success"));
//                     })
//                     .catch((err) => {
//                         res.status(200).send(responseTemplate("error", err));
//                     });
//             })
//             .catch((err) => {
//                 res.status(200).send(responseTemplate("error", err));
//             });
//     } catch (err) {
//         console.log(err);
//         res.status(200).json(JSON.stringify(err));
//     }
// };

exports.addMembers = async (req, res) => {
    const { members } = req.body;
    if (!members.length) {
        res.status(200).send({
            status: 0,
            data: "Please fill all fields.",
        });
        return;
    }

    const tempMembers = members.map((item) => {
        return {
            ...item,
            permission_state: 1,
        };
    });

    db("users")
        .insert(tempMembers)
        .returning("uid")
        .then((data) => {
            const newData = data.map((item) => {
                return {
                    user_uid: item.uid,
                    company_uid: req.company_uid,
                    permission_state: 1,
                };
            });
            db("company_members")
                .insert(newData)
                .then(() => {
                    res.status(200).send(responseTemplate("success", "Success"));
                })
                .catch((err) => {
                    res.status(200).send(responseTemplate("error", err.detail));
                });
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.getAllMembers = async (req, res) => {
    db.select(
        "users.uid",
        "users.first_name",
        "users.last_name",
        "users.email",
        "users_avatar.filename as avatar_img",
        "company_members.permission_state"
    )
        .from("company_members")
        .leftJoin("users", "users.uid", "company_members.user_uid")
        .leftJoin("users_avatar", "users.uid", "users_avatar.user_uid")
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.updateMembersPermissionState = async (req, res) => {
    const { user_uid, permission_state } = req.body;

    db("company_members")
        .where("user_uid", user_uid)
        .andWhere("company_uid", req.company_uid)
        .update("permission_state", permission_state)
        .then(() => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

exports.update = async (req, res) => {
    const { company_name } = req.body;
    const requiredFields = ["company_name"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    const file = req.file;
    const payload = {
        company_name,
    };
    if (file) {
        const fileName = `${uuidv4()}-${Date.now()}.webp`;
        const resize = await sharp(req.file?.buffer)
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(`${path.resolve()}/assets/companies/${fileName}`);
        payload.company_logo = fileName;
    }

    db("companies")
        .where({ uid: req.company_uid })
        .update(payload)
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

exports.delete = async (req, res) => {
    const { uid } = req.body;
    const requiredFields = ["uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("companies")
        .where({ uid })
        .del()
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};
