const { verifyToken } = require('../helpers/jwt');
const { Users } = require('../models');
const Error = require('../helpers/error');

const authUser= async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      throw new Error(401, 'Invalid token');
    }
    const decodedToken = verifyToken(token);
    const user = await Users.findByPk(decodedToken.id);
    if (!user || decodedToken.role !== 'user') {
      throw new Error(401, 'Unauthenticated');
    }
    if (user.confirmed !== true) {
      throw new Error(401, 'Please verify your email first');
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) { 
    next(error);
  }
};

const authAdmin= async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      throw new Error(401, 'Invalid token');
    }
    const decodedToken = verifyToken(token);
    const user = await Users.findByPk(decodedToken.id);
    if (!user || decodedToken.role !== 'admin') {
      throw new Error(401, 'Unauthenticated');
    }
    if (user.confirmed !== true) {
      throw new Error(401, 'Please verify your email first');
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) { 
    next(error);
  }
};

module.exports = { authAdmin, authUser};
