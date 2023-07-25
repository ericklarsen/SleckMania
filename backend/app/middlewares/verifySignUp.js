const db = require("../models");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const { username, email } = req.body;
    const user = await db("users")
        .where("username", username)
        .orWhere("email", email)
        .select("uid");

    if (user.length) {
        res.status(200).send({
            response: "Failed! Username or Email is already in use!",
        });
        return;
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
