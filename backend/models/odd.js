module.exports = (sequelize, DataTypes) => {
  const Odd = sequelize.define(
    "Odd",
    {
      odd_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      home_odd: {
        type: DataTypes.NUMERIC(5, 2),
        allowNull: false,
      },
      draw_odd: {
        type: DataTypes.NUMERIC(5, 2),
        allowNull: false,
      },
      away_odd: {
        type: DataTypes.NUMERIC(5, 2),
        allowNull: false,
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
      tableName: "odds",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Odd.associate = function (models) {
    Odd.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event",
    });
  };

  return Odd;
};
