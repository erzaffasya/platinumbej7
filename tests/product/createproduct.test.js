const { Products } = require("../../models");
const { ProductController } = require("../../controllers/productController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("ProductController.create", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        productName: "New Product",
        quantity: 10,
        price: 100,
      },
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Products.create.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should create product and return created product if successful", async () => {
    const mockProduct = {
      id: 1,
      userID: 1,
      productName: "New Product",
      quantity: 10,
      price: 100,
      avatar: `localhost:${process.env.PORT}/`,
    };
    Products.create.mockResolvedValue(mockProduct);

    const productController = new ProductController();
    const response = await productController.create(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockProduct);
  });
});
