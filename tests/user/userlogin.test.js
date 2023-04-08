const { Users } = require("../../models");
const { getToken } = require("../../helpers/jwt");
const bcrypt = require("bcryptjs");
const { UserController } = require("../../controllers/userController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/jwt");
jest.mock("bcryptjs");
jest.mock("../../helpers/response");

describe("UserController.login", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    };
    res = {};
    next = jest.fn();
    Users.findOne.mockClear();
    getToken.mockClear();
    bcrypt.compare.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should return token if login is successful", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      role: "user",
      confirmed: true,
      password: "hashedPassword",
    };
    Users.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    getToken.mockReturnValue("token");

    const userController = new UserController();
    const response = await userController.login(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toBe("token");
  });
});
