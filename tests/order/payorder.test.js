const { Orders } = require("../../models");
const { OrderController } = require("../../controllers/orderController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("OrderController.payOrder", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Orders.findOne.mockClear();
    Orders.update.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should update order status to paid and return updated order if successful", async () => {
    const mockOrder = {
      id: 1,
      status: "Pending",
    };
    const updatedOrder = {
      id: 1,
      status: "Paid",
    };
    Orders.findOne
      .mockResolvedValueOnce(mockOrder)
      .mockResolvedValueOnce(updatedOrder);
    Orders.update.mockResolvedValue([1]);

    const orderController = new OrderController();
    const response = await orderController.payOrder(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedOrder);
  });
});
