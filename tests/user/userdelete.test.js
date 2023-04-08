const { Users } = require("../../models");
const { UserController } = require("../../controllers/userController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("UserController.deleteByID", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Users.findOne.mockClear();
    Users.destroy.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should delete user and return success message if successful", async () => {
    const mockUser = {
      id: 1,
    };
    Users.findOne.mockResolvedValue(mockUser);
    Users.destroy.mockResolvedValue(1);

    const userController = new UserController();
    const response = await userController.deleteByID(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toBe("User has been deleted");
  });
});
