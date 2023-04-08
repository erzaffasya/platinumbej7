const { Orders } = require("../../models");
const { OrderController } = require("../../controllers/orderController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("OrderController function get", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    Orders.findAll.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should return all orders if successful", async () => {
    const mockOrders = [
      {
        id: 1,
        userID: 1,
        productID: 1,
        quantity: 10,
      },
      {
        id: 2,
        userID: 2,
        productID: 2,
        quantity: 20,
      },
    ];
    Orders.findAll.mockResolvedValue(mockOrders);

    const orderController = new OrderController();
    const response = await orderController.get(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockOrders);
  });
});
