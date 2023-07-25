const { responseTemplate } = require("../middlewares");
const db = require("../models");

const verifyMyCompanyChannelAndDoIHaveTheAccess = async (req, res, next) => {
    const { channel_uid } = req.body;
    const { user_uid, company_uid } = req;

    db.select("channel_members.*")
        .from("channels")
        .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
        .leftJoin("channel_members", "channel_members.channel_uid", "channels.uid")
        .where("company_channels.company_uid", company_uid)
        .andWhere("channels.uid", channel_uid)
        .andWhere("channel_members.user_uid", user_uid)
        .then((data) => {
            console.log(data);
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You don't have access to this channel."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyCompanyRoomAndDoIHaveTheAccess = async (req, res, next) => {
    const { uid } = req.body;
    const { user_uid, company_uid } = req;

    db.select()
        .from("channels")
        .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
        .leftJoin("channel_members", "channel_members.channel_uid", "channels.uid")
        .leftJoin("channel_rooms", "channel_rooms.channel_uid", "channels.uid")
        .leftJoin("rooms", "rooms.uid", "channel_rooms.room_uid")
        .where("company_channels.company_uid", company_uid)
        .andWhere("channel_rooms.room_uid", uid)
        .andWhere("channel_members.user_uid", user_uid)
        .then((data) => {
            console.log(data);
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You're not member from this room."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyThreadAndDoIHaveTheAccess = async (req, res, next) => {
    const { uid } = req.body;
    const { user_uid } = req;

    db.select()
        .from("threads")
        .leftJoin("channel_threads", "channel_threads.thread_uid", "threads.uid")
        .where("threads.uid", uid)
        .andWhere("threads.user_uid", user_uid)
        .then((data) => {
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You're not owner from this thread."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyChannelThreadAndDoIHaveTheAccess = async (req, res, next) => {
    const { thread_uid } = req.body;
    const { user_uid } = req;

    db.select()
        .from("threads")
        .leftJoin("channel_threads", "channel_threads.thread_uid", "threads.uid")
        .leftJoin("channels", "channels.uid", "channel_threads.channel_uid")
        .leftJoin("channel_members", "channel_members.channel_uid", "channels.uid")
        .where("threads.uid", thread_uid)
        .andWhere("channel_members.user_uid", user_uid)
        .then((data) => {
            if (data.length) {
                next();
                return;
            }
            res.status(200).send(
                responseTemplate("error", "You don't have access to this thread.")
            );
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyCommentsAndDoIHaveTheAccess = async (req, res, next) => {
    const { uid } = req.body;
    const { user_uid } = req;

    db.select()
        .from("comments")
        .where("comments.uid", uid)
        .andWhere("comments.user_uid", user_uid)
        .then((data) => {
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You're not owner from this comment."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyRoomMessagesAndDoIHaveTheAccess = async (req, res, next) => {
    const { room_uid } = req.body;
    const { user_uid } = req;

    // db.select()
    //     .from("messages")
    //     .leftJoin("room_messages", "room_messages.message_uid", "messages.uid")
    //     .leftJoin("channel_rooms", "channel_rooms.room_uid", "room_messages.room_uid")
    //     .leftJoin("channel_members", "channel_members.channel_uid", "channel_rooms.channel_uid")
    //     .where("room_messages.room_uid", room_uid)
    //     .andWhere("channel_members.user_uid", user_uid)
    db.select()
        .from("rooms")
        .leftJoin("channel_rooms", "channel_rooms.room_uid", "rooms.uid")
        .leftJoin("channel_members", "channel_members.channel_uid", "channel_rooms.channel_uid")
        .where("channel_rooms.room_uid", room_uid)
        .andWhere("channel_members.user_uid", user_uid)
        .then((data) => {
            console.log(data);
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You don't have access to this room."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyMessageAndDoIHaveTheAccess = async (req, res, next) => {
    const { uid } = req.body;
    const { user_uid } = req;

    db.select()
        .from("messages")
        .where("messages.uid", uid)
        .andWhere("messages.user_uid", user_uid)
        .then((data) => {
            console.log(data);
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You don't have access to this message."));
            }

            next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const verifyMyChannelAndDoIHaveTheAccessAsAdmin = async (req, res, next) => {
    const { uid } = req.body;
    const { user_uid } = req;

    db.select("channels.uid")
        .from("channels")
        .leftJoin("company_channels", "company_channels.channel_uid", "channels.uid")
        .leftJoin("company_members", "company_members.company_uid", "company_channels.company_uid")
        .where("company_members.user_uid", user_uid)
        .andWhere("channels.uid", uid)
        .andWhere("company_members.permission_state", ">=", 2)
        .then((data) => {
            console.log(data);
            if (!data.length) {
                return res
                    .status(200)
                    .send(responseTemplate("error", "You don't have access to this channel."));
            }

            return res.status(200).send(responseTemplate("success", data));
            // next();
        })
        .catch((err) => {
            res.status(200).send(responseTemplate("error", err.detail));
        });
};

const utilities = {
    verifyMyCompanyChannelAndDoIHaveTheAccess,
    verifyMyCompanyRoomAndDoIHaveTheAccess,
    verifyMyThreadAndDoIHaveTheAccess,
    verifyMyChannelThreadAndDoIHaveTheAccess,
    verifyMyCommentsAndDoIHaveTheAccess,
    verifyMyRoomMessagesAndDoIHaveTheAccess,
    verifyMyMessageAndDoIHaveTheAccess,
    verifyMyChannelAndDoIHaveTheAccessAsAdmin,
};

module.exports = utilities;
