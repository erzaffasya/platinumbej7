const { UserController } = require("../controllers/userController");
const userController = new UserController();
const Users = require("../models/users");
const Response = require("../helpers/response");

describe("UserController", () => {
  describe("get()", () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = { json: jest.fn() };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return all users", async () => {
      const users = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ];
      Users.findAll = jest.fn().mockResolvedValue(users);

      await userController.get(req, res, next);

      expect(Users.findAll).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(users);
    });

    test("should throw an error if there are no users", async () => {
      Users.findAll = jest.fn().mockResolvedValue([]);

      await userController.get(req, res, next);

      expect(Users.findAll).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalledWith(new Error(400, "There is no user yet"));
    });

    test("should call next with an error if an error occurs", async () => {
      const error = new Error("Something went wrong");
      Users.findAll = jest.fn().mockRejectedValue(error);

      await userController.get(req, res, next);

      expect(Users.findAll).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
