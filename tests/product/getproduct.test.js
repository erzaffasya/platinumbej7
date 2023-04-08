const { Products } = require("../../models");
const { ProductController } = require("../../controllers/productController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("ProductController function get", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    Products.findAll.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should return all products if successful", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Product 1",
        price: 10,
      },
      {
        id: 2,
        name: "Product 2",
        price: 20,
      },
    ];
    Products.findAll.mockResolvedValue(mockProducts);

    const productController = new ProductController();
    const response = await productController.get(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockProducts);
  });
});
