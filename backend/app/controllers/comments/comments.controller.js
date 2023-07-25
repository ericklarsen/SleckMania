const db = require("../../models");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

exports.get = async (req, res) => {
    const { thread_uid } = req.body;
    const requiredFields = ["thread_uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db.select(
        "comments.*",
        db.raw(
            "json_build_object('user_uid', users.uid, 'first_name',users.first_name, 'last_name',users.last_name, 'avatar_img', users_avatar.filename) as owner"
        )
    )
        .from("comments")
        .leftJoin("thread_comments", "thread_comments.comment_uid", "comments.uid")
        .leftJoin("users", "users.uid", "comments.user_uid")
        .leftJoin("users_avatar", "users_avatar.user_uid", "users.uid")
        .orderBy("comments.uid", "asc")
        .where("thread_comments.thread_uid", thread_uid)
        .then((data) => {
            console.log(data);
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.add = async (req, res) => {
    const { thread_uid, comment_content } = req.body;
    const requiredFields = ["thread_uid", "comment_content"];

    if (!validatorForRequest(res, req, requiredFields, responseTemplate)) {
        return;
    }

    db("comments")
        .insert({
            user_uid: req.user_uid,
            comment_content,
            is_edited: 0,
        })
        .returning("uid")
        .then((data) => {
            db("thread_comments")
                .insert({
                    thread_uid,
                    comment_uid: data[0].uid,
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
    const { uid, comment_content } = req.body;
    const requiredFields = ["uid", "comment_content"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("comments")
        .where({ uid, user_uid: req.user_uid })
        .update({
            comment_content,
            is_edited: 1,
        })
        .then((data) => {
            res.status(200).send(responseTemplate("success", "Success"));
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

    db("comments")
        .where({ uid })
        .del()
        .then((data) => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err));
        });
};
