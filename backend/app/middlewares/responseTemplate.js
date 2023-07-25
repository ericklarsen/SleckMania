const responseTemplate = (status, data) => {
    // 1 : success
    // 0 : error
    return {
        status: status === "success" ? 1 : 0,
        data,
    };
};

module.exports = responseTemplate;
