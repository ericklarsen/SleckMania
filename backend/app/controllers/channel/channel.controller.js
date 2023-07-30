const db = require("../../models");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

exports.getAllChannel = async (req, res) => {
    db.select(
        "channels.*",
        db.raw(
            "CASE WHEN COUNT(channel_rooms.room_uid) > 0 THEN COALESCE(json_agg(DISTINCT json_build_object('room_uid', channel_rooms.room_uid, 'room_name', rooms.room_name)::jsonb), '[]') ELSE '[]' END AS rooms"
        ),
        db.raw(
            "CASE WHEN COUNT(channel_members.user_uid) > 0 THEN COALESCE(json_agg(DISTINCT json_build_object('user_uid', channel_members.user_uid, 'first_name', users.first_name, 'last_name', users.last_name)::jsonb), '[]') ELSE '[]' END AS members"
        )
    )
        .from("channels")
        .leftJoin("channel_rooms", "channels.uid", "channel_rooms.channel_uid")
        .leftJoin("channel_members", "channels.uid", "channel_members.channel_uid")
        .leftJoin("rooms", "rooms.uid", "channel_rooms.room_uid")
        .leftJoin("users", "users.uid", "channel_members.user_uid")
        .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
        .groupBy("channels.uid")
        .where("company_channels.company_uid", "=", req.company_uid)
        // .andWhere("channel_members.user_uid", "<>", req.user_uid)
        .then((data) => {
            const newData = data.map((item) => {
                const temp = {
                    ...item,
                    join: item.members.filter((fil) => fil.user_uid === req.user_uid).length
                        ? true
                        : false,
                };
                delete temp.members;
                return temp;
            });
            res.status(200).send(responseTemplate("success", newData));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.getMyChannel = async (req, res) => {
    db.select(
        "channels.*",
        db.raw(
            "CASE WHEN COUNT(channel_rooms.room_uid) > 0 THEN COALESCE(json_agg(DISTINCT json_build_object('room_uid', channel_rooms.room_uid, 'room_name', rooms.room_name)::jsonb), '[]') ELSE '[]' END AS rooms"
        )
        // db.raw(
        //     "CASE WHEN COUNT(channel_members.user_uid) > 0 THEN COALESCE(json_agg(DISTINCT json_build_object('user_uid', channel_members.user_uid, 'first_name', users.first_name, 'last_name', users.last_name)::jsonb), '[]') ELSE '[]' END AS members"
        // )
    )
        .from("channels")
        .leftJoin("channel_rooms", "channels.uid", "channel_rooms.channel_uid")
        .leftJoin("channel_members", "channels.uid", "channel_members.channel_uid")
        .leftJoin("rooms", "rooms.uid", "channel_rooms.room_uid")
        .leftJoin("users", "users.uid", "channel_members.user_uid")
        .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
        .groupBy("channels.uid")
        .where("company_channels.company_uid", "=", req.company_uid)
        .andWhere("channel_members.user_uid", "=", req.user_uid)
        .then((data) => {
            // console.log(data);
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.add = async (req, res) => {
    const { channel_name, channel_description } = req.body;
    const requiredFields = ["channel_name", "channel_description"];

    if (!validatorForRequest(res, req, requiredFields, responseTemplate)) {
        return;
    }

    const file = req.file;
    if (!file) {
        res.status(200).send(responseTemplate("error", "Please provide your channel logo."));
        return;
    }

    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    sharp(req.file?.buffer)
        .resize(800)
        .toFormat("webp")
        .webp({ quality: 90 })
        .toFile(`${path.resolve()}/assets/companies/${fileName}`)
        .then(() => {
            db("channels")
                .insert({
                    channel_name,
                    channel_logo: fileName,
                    channel_description,
                })
                .returning("uid")
                .then((channel) => {
                    db("channel_members")
                        .insert({
                            channel_uid: channel[0].uid,
                            user_uid: req.user_uid,
                        })
                        .then(() => {
                            db("company_channels")
                                .insert({
                                    channel_uid: channel[0].uid,
                                    company_uid: req.company_uid,
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
                })
                .catch((err) => {
                    res.status(200).send(responseTemplate("error", err.detail));
                });
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.join = async (req, res) => {
    const { channel_uid } = req.body;
    const requiredFields = ["channel_uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("channels")
        .where({ uid: channel_uid })
        .first()
        .then((data) => {
            if (typeof data === "undefined") {
                res.status(200).send(responseTemplate("error", "Channel doesn't exist."));
                return;
            }

            db("channel_members")
                .where({ channel_uid })
                .andWhere({ user_uid: req.user_uid })
                .then((data) => {
                    if (data.length) {
                        res.status(200).send(
                            responseTemplate("error", "You're already in the channel")
                        );
                        return;
                    }
                    db("channel_members")
                        .insert({
                            channel_uid,
                            user_uid: req.user_uid,
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
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.update = async (req, res) => {
    const { uid, channel_name, channel_logo, channel_description } = req.body;
    const requiredFields = ["uid", "channel_name", "channel_description"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("channels")
        .where({ uid })
        .update({
            channel_name,
            channel_logo,
            channel_description,
        })
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

    if (!validatorForRequest(res, req, requiredFields, responseTemplate)) {
        return;
    }

    db("channels")
        .where({ uid })
        .del()
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};

exports.getMembers = (req, res) => {
    const { channel_uid } = req.body;

    db("channel_members")
        .join("users", "channel_members.user_uid", "users.uid")
        .where("channel_members.channel_uid", channel_uid)
        .select("users.uid", "users.first_name", "users.last_name")
        .orderBy("users.first_name", "asc")
        .then((data) => {
            const newData = data.map((item) => {
                return {
                    uid: item.uid,
                    fullname: `${item.first_name} ${item.last_name}`,
                };
            });
            res.status(200).send(responseTemplate("success", newData));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.getRooms = (req, res) => {
    const { channel_uid } = req.body;

    db("channel_rooms")
        .join("rooms", "channel_rooms.room_uid", "rooms.uid")
        .where("channel_rooms.channel_uid", channel_uid)
        // .select("rooms.uid", "rooms.room_name", "rooms.room_logo", "rooms.room_description")
        .select("rooms.*")
        .orderBy("rooms.room_name", "asc")
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};
