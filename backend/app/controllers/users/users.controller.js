const db = require("../../models");
const bcrypt = require("bcryptjs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

exports.updateAvatar = async (req, res) => {
    try {
        // console.log(path.resolve());
        const file = req.file;
        if (!file) return next();

        const filename = `${uuidv4()}-${Date.now()}.webp`;
        await sharp(req.file?.buffer)
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(`${path.resolve()}/assets/users/${filename}`);

        db("users")
            .where({ user_uid: req.user_uid })
            .update({
                avatar_img: filename,
            })
            .then((data) => {
                res.status(200).send(responseTemplate("success", data));
            })
            .catch((err) => {
                res.status(200).send(responseTemplate("error", err));
            });
    } catch (err) {
        res.status(200).send(responseTemplate("error", "Error"));
    }
};

exports.updateDetails = async (req, res) => {
    const { new_password, old_password, email, first_name, last_name, phone } = req.body;
    const requiredFields = ["email", "first_name", "phone"];

    console.log(req.body);

    if (new_password || old_password) {
        requiredFields.push("new_password");
        requiredFields.push("old_password");
    }

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("users")
        .where({ uid: req.user_uid })
        .first()
        .then((data) => {
            const payload = {
                email,
                first_name,
                last_name,
                phone,
            };
            if (new_password || old_password) {
                const passwordIsValid = bcrypt.compareSync(old_password, data.password);
                if (!passwordIsValid) {
                    res.status(200).send(
                        responseTemplate("error", "Old password is not valid, try again.")
                    );
                    return;
                }
                payload.password = bcrypt.hashSync(new_password, 8);
            }

            db("users")
                .where({ uid: req.user_uid })
                .update(payload)
                .then((data) => {
                    res.status(200).send(responseTemplate("success", data));
                })
                .catch((err) => {
                    res.status(200).send(responseTemplate("error", err));
                });
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

exports.getDetails = async (req, res) => {
    db.select(
        "users.*",
        db.raw(
            "json_build_object('company_uid',companies.uid, 'company_name',companies.company_name, 'company_logo',companies.company_logo, 'permission_state',company_members.permission_state) as company"
        )
    )
        .from("users")
        .leftJoin("company_members", "users.uid", "company_members.user_uid")
        .leftJoin("companies", "companies.uid", "company_members.company_uid")
        .where("users.uid", req.user_uid)
        .first()
        .then((data) => {
            delete data.password;
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

// Please handle it later. so users can only login in 2 devices. max users tokens are 2.
exports.checkUserToken = async (req, res) => {};
