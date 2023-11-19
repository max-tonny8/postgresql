module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      event_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      event_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Played"),
        allowNull: false,
        defaultValue: "Active",
      },
      homeTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
      awayTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
    },
    {
      tableName: "events",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Event.associate = function (models) {
    Event.belongsTo(models.Team, {
      as: "HomeTeam",
      foreignKey: "homeTeamId",
    });
    Event.belongsTo(models.Team, {
      as: "AwayTeam",
      foreignKey: "awayTeamId",
    });
    Event.hasMany(models.Odd, {
      foreignKey: "event_id",
      as: "odds",
    });
  };

  return Event;
};
