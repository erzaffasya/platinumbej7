class Response {
  constructor(res, status, data) {
    return res.status(status).json({
      status: status,
      message: "Success",
      data: data,
    });
  }
}

module.exports = Response;
