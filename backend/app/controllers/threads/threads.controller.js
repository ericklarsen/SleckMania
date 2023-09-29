const db = require("../../models");
const { responseTemplate, validatorForRequest } = require("../../middlewares");

exports.get = async (req, res) => {
    const { channel_uid } = req.body;
    const requiredFields = ["channel_uid"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db.select(
        "threads.*",
        db.raw(
            "json_build_object('user_uid', users.uid,'first_name', users.first_name,'last_name', users.last_name, 'avatar_img', users.avatar_img) as owner"
        )
        // "users.uid as user_uid",
        // "users.first_name",
        // "users.last_name"
        // db.raw(
        //     "CASE WHEN COUNT(thread_comments.thread_uid) > 0 THEN COALESCE(json_agg(DISTINCT json_build_object('comment_uid', thread_comments.comment_uid, 'comment_content', comments.comment_content, 'is_edited', comments.is_edited, 'user_uid', users.uid, 'first_name', users.first_name, 'last_name', users.last_name)::jsonb), '[]') ELSE '[]' END AS comments"
        // )
    )
        .from("threads")
        .leftJoin("users", "threads.user_uid", "users.uid")
        // .leftJoin("thread_comments", "threads.uid", "thread_comments.thread_uid")
        // .leftJoin("comments", "thread_comments.comment_uid", "comments.uid")
        .leftJoin("channel_threads", "channel_threads.thread_uid", "threads.uid")
        .orderBy("threads.uid", "asc")
        .groupBy("threads.uid", "users.uid")
        .where("channel_threads.channel_uid", channel_uid)
        .then((data) => {
            res.status(200).send(responseTemplate("success", data));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

exports.add = async (req, res) => {
    const { channel_uid, thread_title, thread_content } = req.body;
    const requiredFields = ["channel_uid", "thread_title"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("threads")
        .insert({
            thread_title,
            thread_content,
            user_uid: req.user_uid,
        })
        .returning("uid")
        .then((data) => {
            db("channel_threads")
                .insert({
                    channel_uid,
                    thread_uid: data[0].uid,
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
    const { uid, thread_title, thread_content } = req.body;
    const requiredFields = ["uid", "thread_title", "thread_content"];

    if (!validatorForRequest(res, req, requiredFields)) {
        return;
    }

    db("threads")
        .where({ uid })
        .update({
            thread_title,
            thread_content,
        })
        .then((data) => {
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

    db("threads")
        .where({ uid })
        .del()
        .then((data) => {
            res.status(200).send(responseTemplate("success", "Success"));
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};
