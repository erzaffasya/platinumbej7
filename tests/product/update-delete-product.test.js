const { Products } = require("../../models");
const { ProductController } = require("../../controllers/productController");
const Response = require("../../helpers/response");

jest.mock("../../models");
jest.mock("../../helpers/response");

describe("ProductController function update", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        productName: "Updated Product",
        quantity: 20,
        price: 200,
      },
      params: {
        id: 1,
      },
      user: {
        id: 1,
      },
    };
    res = {};
    next = jest.fn();
    Products.findOne.mockClear();
    Products.update.mockClear();
    Response.mockImplementation((res, status, data) => ({ status, data }));
  });

  test("should update product and return updated product if successful", async () => {
    const mockProduct = {
      id: 1,
      userID: 1,
      productName: "Old Product",
      quantity: 10,
      price: 100,
    };
    const updatedProduct = {
      id: 1,
      userID: 1,
      productName: "Updated Product",
      quantity: 20,
      price: 200,
    };
    Products.findOne
      .mockResolvedValueOnce(mockProduct)
      .mockResolvedValueOnce(updatedProduct);
    Products.update.mockResolvedValue([1]);

    const productController = new ProductController();
    const response = await productController.update(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedProduct);
  });
});

describe("ProductController function deleteByID", () => {
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
    Products.findOne.mockClear();
    Products.destroy.mockClear();
  });

  test("should delete product and return success message if successful", async () => {
    const mockProduct = {
      id: 1,
      userID: 1,
    };
    Products.findOne.mockResolvedValue(mockProduct);
    Products.destroy.mockResolvedValue(1);

    const productController = new ProductController();
    const response = await productController.deleteByID(req, res, next);

    expect(response.status).toBe(200);
    expect(response.data).toBe("Product has been deleted");
  });
});
