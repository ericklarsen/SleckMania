validatorForRequest = (res, req, requiredFields, responseTemplate) => {
    let isNotValid = 0;

    requiredFields.forEach((key) => {
        if (!req.body[key]) {
            isNotValid++;
        }
    });

    if (isNotValid) {
        res.status(200).send({
            status: 0,
            data: "Please fill all fields.",
        });
        return false;
    }

    return true;
};

module.exports = validatorForRequest;
