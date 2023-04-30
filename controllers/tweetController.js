const { Tweets } = require("../models");
const Error = require("../helpers/error");
const Response = require("../helpers/response");
const { uploadCloudinary } = require('../middlewares/multer');

class TweetController {
  async get(req, res, next) {
    try {
      const page = req.query.page
      const limit = req.query.limit
      const dataTweet = await Tweets.findAll({
        offset: ((page - 1) * limit),
        limit: limit,
      });
      return new Response(res, 200, dataTweet);
    } catch (error) {
      next(error);
    }
  }
  async show(req, res, next) {
    try {
      const dataTweet = await Tweets.findOne({
        id: req.params
      });
      return new Response(res, 200, dataTweet);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const { tweet } = req.body;
      const createTweet = await Tweets.create({
        userID: req.user.id,
        tweet,
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
      const updateTweet = await Tweets.update(
        {
          tweet: tweet
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

      if (dataTweet.userID !== req.user.id && req.user.role != 'admin') {
        throw new Error(401, "Unauthorized to make changes");
      } else {
        if (dataTweet.userID !== req.user.id) {
          const updateTweet = await Tweets.update(
            {
              tweet: "Tweet has been deleted by admin",
              oldTweet: dataTweet.tweet
            },
            { where: { id: id } }
          );
        } else {
          const deleteTweet = await Tweets.destroy({
            where: { id: id },
          });
        }
      }
      return new Response(res, 200, "Tweet has been deleted");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { TweetController };
