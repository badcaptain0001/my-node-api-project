const successResponse = (res, message, data) => {
    res.status(200).json({
        message,
        status: "success",
        data,
    });
};

const badRequestResponse = (res, message) => {
    res.status(400).json({
        message,
        status: "bad request",
    });
};

const unauthorizedResponse = (res, message) => {
    res.status(401).json({
        message,
        status: "unauthorized",
    });
};

const notFoundResponse = (res, message) => {
    res.status(404).json({
        message,
        status: "not found",
    });
};

const failureResponse = (res, message) => {
    res.status(500).json({
        message : message,
        status: "failed",
    });
};

module.exports = {successResponse, badRequestResponse, unauthorizedResponse, notFoundResponse, failureResponse};