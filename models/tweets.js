'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tweets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tweets.belongsTo(models.Users, { foreignKey: 'userID' });
    }
  }
  Tweets.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tweet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      oldTweet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Tweets',
      timestamps: true,
      freezeTableName: true,
    }
  );
  return Tweets;
};
