const db = require("../../models");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

exports.get = async (req, res) => {
    const { room_uid } = req.body;
    const requiredFields = ["room_uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db.select(
        "messages.*",
        db.raw(
            "json_build_object('user_uid',users.uid, 'first_name', users.first_name, 'last_name', users.last_name) as owner"
        )
    )
        .from("messages")
        .leftJoin("room_messages", "room_messages.message_uid", "messages.uid")
        .leftJoin("users", "users.uid", "messages.user_uid")
        .orderBy("messages.uid", "asc")
        .where("room_messages.room_uid", room_uid)
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.add = async (req, res) => {
    const { room_uid, message_content } = req.body;
    const requiredFields = ["room_uid", "message_content"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("messages")
        .insert({
            user_uid: req.user_uid,
            message_content,
            is_edited: 0,
        })
        .returning("uid")
        .then((data) => {
            db("room_messages")
                .insert({
                    room_uid,
                    message_uid: data[0].uid,
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
    const { uid, message_content } = req.body;
    const requiredFields = ["uid", "message_content"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("messages")
        .where({ uid, user_uid: req.user_uid })
        .update({
            message_content,
            is_edited: 1,
        })
        .then(() => {
            res.status(200).send(responseTemplate("success", "Success"));
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

    db("messages")
        .where({ uid })
        .del()
        .then(() => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};
