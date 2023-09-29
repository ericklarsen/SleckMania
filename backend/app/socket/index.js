const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

module.exports = function (httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            allowedHeaders: ["x-access-token"],
            credentials: true,
        },
        // pingInterval: 10000, // how often to ping/pong.
        // pingTimeout: 30000, // time after which the connection is considered timed-out.
    });

    io.on("connection", (socket) => {
        console.log("We are live and connected");
        console.log("token: ", socket.handshake.auth.token);

        socket.on("tester", (data) => {
            console.log(data);
        });
        if (socket.handshake.auth.token) {
            const token = socket.handshake.auth.token;
            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    console.log("Authentication error, Invalid Token supplied");
                    return;
                }

                db("users_token")
                    .where({ user_uid: decoded.user_uid, token })
                    .then(async (data) => {
                        if (!data.length) {
                            return;
                        }

                        const userDetails = await db("users")
                            .where("uid", decoded.user_uid)
                            .first();
                        const companyDetails = await db("company_members")
                            .where("user_uid", decoded.user_uid)
                            .first();

                        require("./rooms/rooms.socket")(userDetails, io, socket);

                        socket.join("clock-room");
                        io.emit("connected", socket.id);
                    })
                    .catch((err) => {
                        console.log(err);
                        socket.disconnect();
                    });
            });
        } else {
            socket.disconnect();
        }
    });

    setInterval(() => {
        io.to("clock-room").emit("time", new Date().toISOString());
    }, 1000);
};
