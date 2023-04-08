const { Products } = require("../models");
const Error = require("../helpers/error");
const Response = require("../helpers/response");

class ProductController {
  async get(req, res, next) {
    try {
      const dataProduct = await Products.findAll({});
      return new Response(res, 200, dataProduct);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const { productName, quantity, price } = req.body;
      const createProduct = await Products.create({
        userID: req.user.id,
        productName,
        quantity,
        price,
        avatar: `localhost:${process.env.PORT}/${req.file.path}`
      });
      return new Response(res, 200, createProduct);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { productName, quantity, price } = req.body;
      const { id } = req.params;
      const searchID = await Products.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no product with ID ${id}`);
      }
      if (searchID.userID !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const updateUser = await Products.update(
        {
          productName: productName,
          quantity: quantity,
          price: price,
        },
        { where: { id: id } }
      );
      const updatedProduct = await Products.findOne({
        where: { id: id },
      });
      return new Response(res, 200, updatedProduct);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.params;
      const dataProduct = await Products.findOne({
        where: { id: id },
      });
      if (!dataProduct) {
        throw new Error(400, `There is no product with ID ${id}`);
      }
      if (dataProduct.userID !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const deleteProduct = await Products.destroy({
        where: { id: id },
      });
      return new Response(res, 200, "Product has been deleted");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { ProductController };
