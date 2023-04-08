const { Orders, Products } = require("../../models");
const { OrderController } = require("../../controllers/orderController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("OrderController function update", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        id: 1,
        productID: 2,
        productName: "Updated Product",
        toStreet: "Updated Street",
        toCity: "Updated City",
      },
    };
    res = {};
    next = jest.fn();
    Orders.findOne.mockClear();
    Products.findOne.mockClear();
    Orders.update.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should update order and return updated order if successful", async () => {
    const mockOrder = {
      id: 1,
      productID: 1,
      productName: "Old Product",
      toStreet: "Old Street",
      toCity: "Old City",
    };
    const mockProduct = {
      id: 2,
      productName: "Updated Product",
    };
    const updatedOrder = {
      id: 1,
      productID: 2,
      productName: "Updated Product",
      toStreet: "Updated Street",
      toCity: "Updated City",
    };
    Orders.findOne
      .mockResolvedValueOnce(mockOrder)
      .mockResolvedValueOnce(updatedOrder);
    Products.findOne.mockResolvedValue(mockProduct);
    Orders.update.mockResolvedValue([1]);

    const orderController = new OrderController();
    const response = await orderController.update(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedOrder);
  });
});

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
