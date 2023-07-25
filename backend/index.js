require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { createServer } = require("http");
const httpServer = createServer(app);

const PORT = process.env.PORT || 8080;
const corsOptions = {
    // origin: process.env.ORIGIN,
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Sleck API" });
});
httpServer.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
});

require("./app/routes")(app);
require("./app/socket")(httpServer);

module.exports = app;
