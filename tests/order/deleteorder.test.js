const { Orders, Products } = require("../../models");
const { OrderController } = require("../../controllers/orderController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("OrderController function deleteByID", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: 1,
      },
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Orders.findOne.mockClear();
    Orders.destroy.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should delete order and return success message if successful", async () => {
    const mockOrder = {
      id: 1,
      userID: 1,
    };
    Orders.findOne.mockResolvedValue(mockOrder);
    Orders.destroy.mockResolvedValue(1);

    const orderController = new OrderController();
    const response = await orderController.deleteByID(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toBe("Order has been deleted");
  });
});
