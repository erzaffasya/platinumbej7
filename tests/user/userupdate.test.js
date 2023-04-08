const { Users } = require("../../models");
const { UserController } = require("../../controllers/userController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("UserController Function update()", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: "New Name",
        email: "newemail@example.com",
        street: "New Street",
        city: "New City",
      },
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Users.findOne.mockClear();
    Users.update.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should update user and return updated user if successful", async () => {
    const mockUser = {
      id: 1,
      name: "Old Name",
      email: "oldemail@example.com",
      street: "Old Street",
      city: "Old City",
    };
    const updatedUser = {
      id: 1,
      name: "New Name",
      email: "newemail@example.com",
      street: "New Street",
      city: "New City",
    };
    Users.findOne
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(updatedUser);
    Users.update.mockResolvedValue([1]);

    const userController = new UserController();
    const response = await userController.update(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedUser);
  });
});
