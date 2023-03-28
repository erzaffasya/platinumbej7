const jwt = require('jsonwebtoken')

const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET)
}

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = { getToken, verifyToken };