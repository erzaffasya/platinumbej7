const { Tweets } = require("../models");
const Error = require("../helpers/error");
const Response = require("../helpers/response");
const { uploadCloudinary } = require('../middlewares/multer');

class TweetController {
  async get(req, res, next) {
    try {
      const dataTweet = await Tweets.findAll({});
      return new Response(res, 200, dataTweet);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const { tweet, quantity, price } = req.body;
      const imageUrl = await uploadCloudinary(req.file.path)
      const createTweet = await Tweets.create({
        userID: req.user.id,
        tweet,
        quantity,
        price,
        avatar: imageUrl,
      });
      return new Response(res, 200, createTweet);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { tweet, quantity, price } = req.body;
      const { id } = req.params;
      const searchID = await Tweets.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no tweet with ID ${id}`);
      }
      if (searchID.userID !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const updateUser = await Tweets.update(
        {
          tweet: tweet,
          quantity: quantity,
          price: price,
        },
        { where: { id: id } }
      );
      const updatedTweet = await Tweets.findOne({
        where: { id: id },
      });
      return new Response(res, 200, updatedTweet);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.params;
      const dataTweet = await Tweets.findOne({
        where: { id: id },
      });
      if (!dataTweet) {
        throw new Error(400, `There is no tweet with ID ${id}`);
      }
      if (dataTweet.userID !== req.user.id) {
        throw new Error(401, "Unauthorized to make changes");
      }
      const deleteTweet = await Tweets.destroy({
        where: { id: id },
      });
      return new Response(res, 200, "Tweet has been deleted");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { TweetController };
