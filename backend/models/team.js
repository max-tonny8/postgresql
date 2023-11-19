module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
    {
      team_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      teamImage: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "teams",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Team.associate = function (models) {
    Team.hasMany(models.Event, {
      foreignKey: "homeTeamId",
      as: "HomeEvents",
    });
    Team.hasMany(models.Event, {
      foreignKey: "awayTeamId",
      as: "AwayEvents",
    });
  };

  return Team;
};
