const db = require("../../models");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

exports.get = async (req, res) => {
    const { channel_uid } = req.body;
    const requiredFields = ["channel_uid"];
    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db.select("rooms.*")
        .from("rooms")
        .leftJoin("channel_rooms", "channel_rooms.room_uid", "rooms.uid")
        .where("channel_rooms.channel_uid", channel_uid)
        .orderBy("uid", "asc")
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.getDetails = async (req, res) => {
    const { uid } = req.body;
    const requiredFields = ["uid"];
    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db.select("rooms.*")
        .from("rooms")
        .where("rooms.uid", uid)
        .first()
        .then((data) => {
            res.status(200).send(responseTemplate("success", data === undefined ? {} : data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.add = async (req, res) => {
    const { channel_uid, room_name, room_description } = req.body;
    const requiredFields = ["channel_uid", "room_name", "room_description"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    // const myCompanyChannelAndDoIHaveTheAccess = await db
    //     .select("channel_members.*")
    //     .from("channels")
    //     .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
    //     .leftJoin("channel_members", "channel_members.channel_uid", "channels.uid")
    //     .where("company_channels.company_uid", req.company_uid)
    //     .andWhere("channels.uid", channel_uid)
    //     .andWhere("channel_members.user_uid", req.user_uid);

    // // console.log(myCompanyChannelAndDoIHaveTheAccess);

    // const check = await isMyCompanyChannelAndDoIHaveTheAccess({
    //     res,
    //     company_uid: req.company_uid,
    //     channel_uid,
    //     user_uid: req.user_uid,
    // });

    // console.log(check);

    // if (!check) {
    //     return;
    // }

    const file = req.file;
    let fileName = "";
    if (file) {
        fileName = `${uuidv4()}-${Date.now()}.webp`;
        await sharp(req.file?.buffer)
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(`${path.resolve()}/assets/rooms/${fileName}`)
            .catch((err) => {
                console.log(err);
                res.status(200).send(responseTemplate("error", "Failed to upload logo."));
            });
    }

    db("rooms")
        .insert({
            room_name,
            room_logo: fileName,
            room_description,
        })
        .returning("uid")
        .then((data) => {
            db("channel_rooms")
                .insert({
                    channel_uid,
                    room_uid: data[0].uid,
                })
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

exports.update = async (req, res) => {
    const { uid, room_name, room_description } = req.body;
    const requiredFields = ["uid", "room_name", "room_description"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    const file = req.file;
    let fileName = "";
    if (file) {
        fileName = `${uuidv4()}-${Date.now()}.webp`;
        await sharp(req.file?.buffer)
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 90 })
            .toFile(`${path.resolve()}/assets/rooms/${fileName}`)
            .catch((err) => {
                console.log(err);
                res.status(200).send(responseTemplate("error", "Failed to upload logo."));
            });
    }

    db("rooms")
        .where({ uid })
        .update({
            room_name,
            room_description,
            ...(fileName ? { room_logo: fileName } : {}),
        })
        .then(() => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.delete = async (req, res) => {
    const { uid } = req.body;
    const requiredFields = ["uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("rooms")
        .where({ uid })
        .del()
        .then(() => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};
