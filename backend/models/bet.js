module.exports = (sequelize, DataTypes) => {
  const Bet = sequelize.define(
    "Bet",
    {
      bet_decision: {
        type: DataTypes.ENUM("Home", "Draw", "Away"),
        allowNull: false,
      },
      bet_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      potential_win: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Placed", "Won", "Lost"),
        allowNull: false,
        defaultValue: "Placed",
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
    },
    {
      tableName: "bets",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Bet.associate = function (models) {
    Bet.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Bet.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event",
    });
  };

  return Bet;
};
