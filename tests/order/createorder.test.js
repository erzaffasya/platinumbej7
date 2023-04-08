const { Orders, Users, Products } = require("../../models");
const { OrderController } = require("../../controllers/orderController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("OrderController funtion create", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        productID: 1,
        productName: "Product",
        toStreet: "Street",
        toCity: "City",
        status: "Pending",
      },
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Users.findOne.mockClear();
    Products.findOne.mockClear();
    Orders.create.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should create order and return created order if successful", async () => {
    const mockUser = {
      id: 1,
      street: "Street",
      city: "City",
    };
    const mockProduct = {
      id: 1,
      productName: "Product",
    };
    const mockOrder = {
      id: 1,
      productID: 1,
      productName: "Product",
      userID: 1,
      toStreet: "Street",
      toCity: "City",
      status: "Pending",
    };
    Users.findOne.mockResolvedValue(mockUser);
    Products.findOne.mockResolvedValue(mockProduct);
    Orders.create.mockResolvedValue(mockOrder);

    const orderController = new OrderController();
    const response = await orderController.create(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockOrder);
  });
});
