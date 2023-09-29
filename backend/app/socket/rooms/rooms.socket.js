const db = require("../../models");
let typingList = {};

module.exports = function (userDetails, io, socket) {
    const getAllMessagesFromRoom = ({ room_uid, callback }) => {
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
            .then((messages) => {
                if (callback) callback(messages);
            })
            .catch((err) => {
                console.log(err.detail);
            });
    };

    const sendMessage = ({ room_uid, message, callback }) => {
        db("messages")
            .insert({
                user_uid: userDetails.uid,
                message_content: message,
                is_edited: 0,
            })
            .returning("uid")
            .then((message) => {
                db("room_messages")
                    .insert({
                        room_uid,
                        message_uid: message[0].uid,
                    })
                    .then(() => {
                        if (callback) callback();
                    })
                    .catch((err) => {
                        console.log(err.detail);
                    });
            })
            .catch((err) => {
                console.log(err.detail);
            });
    };

    socket.on("join_room", (room_uid) => {
        socket.join("room-" + room_uid);
        io.sockets.in("room-" + room_uid).emit("connectToRoom", "You are in room no. " + room_uid);
        getAllMessagesFromRoom({
            room_uid,
            callback: (messages) => {
                io.sockets.in("room-" + room_uid).emit("receive_message", JSON.stringify(messages));
            },
        });
    });

    socket.on("leave_room", (room_uid) => {
        socket.leave("room-" + room_uid);
    });

    socket.on("send_typing", (obj) => {
        const { room_uid, user_details } = obj;
        const roomName = "room-" + room_uid;

        if (!typingList[roomName]) {
            typingList[roomName] = [];
        }

        const check = typingList[roomName].filter((fil) => fil.uid === user_details.uid);

        if (check.length) {
            if (!user_details.typing) {
                typingList[roomName] = typingList[roomName].filter(
                    (fil) => fil.uid !== user_details.uid
                );
            }
        } else {
            typingList[roomName].push(user_details);
        }

        console.log("user is typing", user_details.typing);

        io.sockets.in(roomName).emit("receive_typing", typingList[roomName]);
    });

    socket.on("send_message", (data) => {
        const { room_uid, message } = data;
        sendMessage({
            room_uid,
            message,
            callback: () => {
                getAllMessagesFromRoom({
                    room_uid,
                    callback: (messages) => {
                        io.sockets
                            .in("room-" + room_uid)
                            .emit("receive_message", JSON.stringify(messages));
                    },
                });
            },
        });
    });

    // io.emit("GET_USER_DETAILS", userDetails);
};
