const { Users } = require("../models");
const Error = require("../helpers/error");
const Response = require("../helpers/response");
const { getToken, verifyToken } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const transporter = require("../helpers/nodemailer");
const nodemailer = require("nodemailer");

class UserController {
  async get(req, res, next) {
    try {
      const data = await Users.findAll({});
      if (data.length < 1) {
        throw new Error(400, "There is no user yet");
      }
      return new Response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { name, email, password, street, city, role } = req.body;
      const checkEmail = await Users.findOne({ where: { email } });
      if (checkEmail) {
        console.log(process.env.EMAIL_TRANSPORTER);
        throw new Error(400, `Email ${email} is already registered`);
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const createUser = await Users.create({
        name,
        email,
        password: hashPassword,
        street,
        city,
        role,
        confirmed: false,
      });
      const checkUser = await Users.findOne({ where: { email } });
      const payload = {
        id: checkUser.id,
        email: checkUser.email,
        confirmed: checkUser.confirmed,
      };
      const token = getToken(payload);
      const url = `http://localhost:${process.env.PORT}/api/user/verify/?token=${token}`;
      const msg = {
        from: `'The Four Emperors <${process.env.EMAIL_TRANSPORTER}>'`,
        to: `${email}`,
        subject: "Invitation to Join Yonko",
        text: `Click this link to confirm your registration: "${url}"`,
      };
      const send = await transporter.sendMail(msg);
      return new Response(res, 200, createUser);
    } catch (error) {
      next(error);
    }
  }
  async verify(req, res, next) {
    try {
      const decodedID = verifyToken(req.query.token);
      const verifyUser = await Users.update(
        {
          confirmed: true,
        },
        { where: { id: decodedID.id } }
      );
      return new Response(res, 200, 'User verified and confirmed')
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const checkEmail = await Users.findOne({ where: { email } });
      if (!checkEmail) {
        throw new Error(400, `Email ${email} is not registered yet`);
      }
      if (checkEmail.confirmed !== true) {
        throw new Error(
          400,
          "Invalid request, please confirm your email first"
        );
      }
      const passwordLogin = await bcrypt.compare(password, checkEmail.password);
      if (!passwordLogin) {
        throw new Error(400, "Password is incorrect");
      }
      const checkUser = await Users.findOne({ where: { email } });
      const payload = {
        id: checkUser.id,
        email: checkUser.email,
        role: checkUser.role,
        confirmed: checkUser.confirmed,
      };
      const token = getToken(payload);
      return new Response(res, 200, token);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { name, email, street, city } = req.body;
      const { id } = req.user;
      const searchID = await Users.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no user with ID ${id}`);
      }
      if (searchID.id !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const updateUser = await Users.update(
        {
          name: name,
          email: email,
          street: street,
          city: city,
        },
        { where: { id: id } }
      );
      const newUser = await Users.findOne({
        where: { id: id },
      });
      return new Response(res, 200, newUser);
    } catch (error) {
      next(error);
    }
  }
  async updateAvatar(req, res, next) {
    try {
      const searchUser = await Users.findOne({
        where: { id: req.user.id },
      });
      if (searchUser.id !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const updateAva = await Users.update(
        {
          avatar: `localhost:${process.env.PORT}/${req.file.path}`,
        },
        { where: { id: req.user.id } }
      );
      return new Response(res, 200, "Succes update avatar");
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.user;
      const dataUser = await Users.findOne({
        where: { id: id },
      });
      if (!dataUser) {
        throw new Error(400, `There is no user with ID ${id}`);
      }
      if (dataUser.id !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const deleteUser = await Users.destroy({ where: { id: id } });
      return new Response(res, 200, "User has been deleted");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
