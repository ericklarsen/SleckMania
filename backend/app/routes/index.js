module.exports = function (app) {
    require("./auth/auth.routes")(app);
    require("./companies/companies.routes")(app);
    require("./channels/channels.routes")(app);
    require("./rooms/rooms.routes")(app);
    require("./threads/threads.routes")(app);
    require("./comments/comments.routes")(app);
    require("./messages/messages.routes")(app);
    require("./assets/assets.routes")(app);
    require("./users/users.routes")(app);
};
