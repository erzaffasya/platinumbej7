class Response {
    constructor(res, status, data) {
        return res.status(status).json({
          status: 'Success',
          data: data
        })
    }
}

module.exports = Response 