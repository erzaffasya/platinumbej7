const { UserController } = require("../../controllers/userController");
const { Users } = require("../../models");
const { uploadCloudinary } = require("../../middlewares/multer");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../middlewares/multer");
jest.mock("../../helpers/response");

describe("UserController.updateAvatar", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      file: { path: "testPath" },
      user: { id: 1 },
    };
    res = {};
    next = jest.fn();
    uploadCloudinary.mockResolvedValue("testUrl");
    Users.findOne.mockResolvedValue({ id: 1 });
    Users.update.mockResolvedValue({});
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  it("should update the avatar and return a success message", async () => {
    const userController = new UserController();
    const response = await userController.updateAvatar(req, res, next);
    expect(response.status).toBe(200);
    expect(response.data).toBe("Succes update avatar");
  });
});
