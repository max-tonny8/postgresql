const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: true,
      hooks: {
        beforeValidate: (user, options) => {
          if (user.email) {
            user.email = user.email.toLowerCase();
          }
        },
        beforeCreate: async (user, options) => {
          if (user.password_hash) {
            const hashedPassword = await bcrypt.hash(user.password_hash, 10);
            user.password_hash = hashedPassword;
          }
        },
        beforeUpdate: async (user, options) => {
          if (user.changed("password_hash")) {
            const hashedPassword = await bcrypt.hash(user.password_hash, 10);
            user.password_hash = hashedPassword;
          }
          user.updatedAt = new Date();
        },
      },
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Bet, {
      foreignKey: "user_id",
      as: "bet",
    });
  };

  return User;
};
