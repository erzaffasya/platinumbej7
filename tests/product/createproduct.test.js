const { Products } = require("../../models");
const { ProductController } = require("../../controllers/productController");
const { uploadCloudinary } = require("../../middlewares/multer");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../middlewares/multer");
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
      file: { path: "testPath" },
    };
    res = {};
    next = jest.fn();
    Products.create.mockClear();
    uploadCloudinary.mockResolvedValue("testUrl");
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should create product and return created product if successful", async () => {
    const mockProduct = {
      id: 1,
      userID: 1,
      productName: "New Product",
      quantity: 10,
      price: 100,
      avatar: req.file.path,
    };
    Products.create.mockResolvedValue(mockProduct);

    const productController = new ProductController();
    const response = await productController.create(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockProduct);
  });
});
