const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const db = require("../../models");
const config = require("../../config/auth.config");
const { responseTemplate } = require("../../middlewares");

/** Add a new user */
exports.register = async (req, res) => {
    const { username, password, email, first_name, last_name, phone, company_name } = req.body;
    const requiredFields = ["username", "password", "email", "first_name", "phone", "company_name"];
    let isNotValid = 0;

    requiredFields.forEach((key) => {
        if (!req.body[key]) {
            isNotValid++;
        }
    });

    if (isNotValid) {
        res.status(200).send(responseTemplate("error", "Please fill all fields."));
        return;
    }

    const passwordHas = bcrypt.hashSync(password, 8);

    const file = req.file;
    if (!file) {
        res.status(200).send(responseTemplate("error", "Please provide your company logo."));
        return;
    }

    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const resize = await sharp(req.file?.buffer)
        .resize(800)
        .toFormat("webp")
        .webp({ quality: 90 })
        .toFile(`${path.resolve()}/assets/companies/${fileName}`);

    console.log(resize);

    try {
        db("users")
            .insert({
                username,
                password: passwordHas,
                email,
                first_name,
                last_name,
                phone,
                permission_state: 0,
            })
            .returning("uid")
            .then((userData) => {
                db("users_avatar")
                    .insert({
                        user_uid: userData[0].uid,
                        filename: "",
                    })
                    .then(() => {
                        db("companies")
                            .insert({
                                company_name,
                                company_logo: fileName,
                            })
                            .returning("uid")
                            .then((companyData) => {
                                db("company_members")
                                    .insert({
                                        company_uid: companyData[0].uid,
                                        user_uid: userData[0].uid,
                                        permission_state: 3, // super member
                                    })
                                    .returning("uid")
                                    .then(() => {
                                        res.status(200).send(
                                            responseTemplate("success", "Success")
                                        );
                                    });
                            });
                    });
            });
    } catch (err) {
        res.status(200).send(responseTemplate("error", err.detail));
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    db.select("users.*", "users_avatar.filename as avatar_img")
        .from("users")
        .leftJoin("users_avatar", "users.uid", "users_avatar.user_uid")
        .where({ username })
        .first()
        .then(async (data) => {
            if (!data) {
                res.status(200).send(
                    responseTemplate("error", "Wrong username or password, try again. ")
                );
                return;
            }

            const passwordIsValid = bcrypt.compareSync(password, data.password);

            if (!passwordIsValid) {
                res.status(200).send(
                    responseTemplate("error", "Wrong username or password, try again.")
                );
                return;
            }

            const usersCompany = await db("company_members").where("user_uid", data.uid).first();
            const token = jwt.sign(
                {
                    user_uid: data.uid,
                    permission_state: data?.permission_state,
                    company_uid: usersCompany?.company_uid,
                    company_permission_state: usersCompany?.company_permission_state,
                },
                config.secret
            );

            db("users_token")
                .insert({
                    user_uid: data.uid,
                    token,
                })
                .then(() => {
                    delete data.password;
                    data.avatar_img = data.avatar_img;
                    res.status(200).send(
                        responseTemplate("success", {
                            ...data,
                            token,
                        })
                    );
                })
                .catch((error) => {
                    res.status(200).send(responseTemplate("error", error));
                });
        })
        .catch((error) => {
            res.status(200).send(responseTemplate("error", error));
        });
};

exports.logout = (req, res) => {
    const { user_uid, token } = req;

    db("users_token")
        .where({ user_uid, token })
        .del()
        .then(() => {
            res.status(200).send(responseTemplate("success", "Successfully logout."));
        })
        .catch((error) => {
            res.status(500).send(responseTemplate("error", error));
        });
};
