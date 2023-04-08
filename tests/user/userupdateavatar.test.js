const { Users } = require("../../models");
const { UserController } = require("../../controllers/userController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("UserController.updateAvatar", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
      },
      file: {
        path: "path/to/avatar",
      },
    };
    res = {};
    next = jest.fn();
    Users.findOne.mockClear();
    Users.update.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should update avatar and return success message if successful", async () => {
    const mockUser = {
      id: 1,
      avatar: "oldAvatar",
    };
    Users.findOne.mockResolvedValue(mockUser);
    Users.update.mockResolvedValue([1]);

    const userController = new UserController();
    const response = await userController.updateAvatar(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toBe("Succes update avatar");
  });

  // Add more tests to cover different scenarios
});
