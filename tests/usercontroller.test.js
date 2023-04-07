const { UserController } = require("../controllers/userController");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { getToken, verifyToken } = require("../helpers/jwt");
const Error = require("../helpers/error");
const Response = require("../helpers/response");
const transporter = require("../helpers/nodemailer");

jest.mock("../models");
jest.mock("bcryptjs");
jest.mock("../helpers/jwt");
jest.mock("../helpers/error");
jest.mock("../helpers/nodemailer");
//jest.mock("../helpers/response");
//jest.mock("../helpers/response", () => Response);

describe("UserController", () => {
  let userController;
  let findAllSpy;

  beforeEach(() => {
    userController = new UserController();
    findAllSpy = jest.spyOn(Users, "findAll");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // == FUNCTION GET ==
  describe("Function get()", () => {
    it("should return all users", async () => {
      // Arrange
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      findAllSpy.mockResolvedValue(users);
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await userController.get({}, res, jest.fn());

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: users,
        status: "Success",
      });
    });

    it("should throw an error if there are no users", async () => {
      // Arrange
      findAllSpy.mockResolvedValue([]);
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      try {
        await userController.get({}, res, jest.fn());
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(400);
        expect(error.message).toBe("There is no user yet");
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: "There is no user yet",
        });
      }
    });

    it("should call the next middleware with an error if there is an error", async () => {
      // Arrange
      const nextMiddleware = jest.fn();
      const error = new Error(500, "Internal Server Error");
      findAllSpy.mockRejectedValue(error);
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Act
      await userController.get({}, res, nextMiddleware);

      // Assert
      expect(nextMiddleware).toHaveBeenCalledWith(error);
    });
  });

  // == FUNCTION REGISTER ==
  describe("Function register()", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password",
          street: "123 Main St",
          city: "Anytown",
          role: "user",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new user and send a confirmation email", async () => {
      Users.findOne.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce("hashedPassword");
      Users.create.mockResolvedValueOnce({ id: 1 });
      Users.findOne.mockResolvedValueOnce({
        id: 1,
        email: "test@example.com",
        confirmed: false,
      });
      getToken.mockReturnValueOnce("token");
      transporter.sendMail.mockResolvedValueOnce();

      await userController.register(req, res, next);

      expect(Users.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(Users.create).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        street: "123 Main St",
        city: "Anytown",
        role: "user",
        confirmed: false,
      });
      expect(getToken).toHaveBeenCalledWith({
        id: 1,
        email: "test@example.com",
        confirmed: false,
      });
      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: `'The Four Emperors <${process.env.EMAIL_TRANSPORTER}>'`,
        to: "test@example.com",
        subject: "Invitation to Join Yonko",
        text: `Click this link to confirm your registration: "http://localhost:${process.env.PORT}/api/user/verify/?token=token"`,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: 1 },
        status: "Success",
      });
    });

    it("should throw an error if the email is already registered", async () => {
      Users.findOne.mockResolvedValueOnce({ id: 1 });

      await userController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new Error(400, `Email test@example.com is already registered`)
      );
    });
  });

  // == FUNCTION VERIFY ==
  describe("Function verify()", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        query: {
          token: "token",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should verify and confirm a user", async () => {
      verifyToken.mockReturnValueOnce({ id: 1 });
      Users.update.mockResolvedValueOnce();

      await userController.verify(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith("token");
      expect(Users.update).toHaveBeenCalledWith(
        { confirmed: true },
        { where: { id: 1 } }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: "User verified and confirmed",
        status: "Success",
      });
    });

    it("should throw an error if the token is invalid", async () => {
      verifyToken.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      await userController.verify(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Invalid token"));
    });
  });

  // == FUNCTION LOGIN ==
  describe("Function login()", () => {
    let req, res, next, userController;

    beforeEach(() => {
      req = { body: { email: "test@example.com", password: "password" } };
      res = {};
      next = jest.fn();
      userController = new UserController();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should throw an error if the user is not registered", async () => {
      Users.findOne.mockResolvedValueOnce(null);

      await userController.login(req, res, next);

      expect(Error).toHaveBeenCalledWith(
        400,
        `Email ${req.body.email} is not registered yet`
      );
      expect(next).toHaveBeenCalledWith(new Error());
    });

    it("should throw an error if the user has not confirmed their email", async () => {
      Users.findOne.mockResolvedValueOnce({ confirmed: false });

      await userController.login(req, res, next);

      expect(Error).toHaveBeenCalledWith(
        400,
        "Invalid request, please confirm your email first"
      );
      expect(next).toHaveBeenCalledWith(new Error());
    });

    it("should throw an error if the password is incorrect", async () => {
      const passwordMatches = false;
      Users.findOne.mockResolvedValueOnce({
        password: "hashedPassword",
        confirmed: true,
      });
      bcrypt.compare.mockResolvedValueOnce(passwordMatches);

      await userController.login(req, res, next);

      expect(Error).toHaveBeenCalledWith(400, "Password is incorrect");
      expect(next).toHaveBeenCalledWith(new Error());
    });

    it("should return a token if the email and password are correct and user has confirmed their email", async () => {
      // Arrange
      const user = {
        id: 1,
        email: req.body.email,
        role: "user",
        confirmed: true,
      };
      const passwordMatches = true;
      const token = "token";
      Users.findOne.mockResolvedValueOnce(user);
      bcrypt.compare.mockResolvedValueOnce(passwordMatches);
      getToken.mockReturnValueOnce(token);
      const responseMock = { json: jest.fn(), status: jest.fn() };
      const res = {
        status: jest.fn().mockReturnValue(responseMock),
        json: jest.fn(),
      };

      // Act
      await userController.login(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({ data: token });
    });

    it("should call next with an error if an error occurs during execution", async () => {
      const error = new Error("error message");
      Users.findOne.mockRejectedValueOnce(error);

      await userController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
