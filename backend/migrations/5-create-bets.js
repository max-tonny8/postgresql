"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bet_decision: {
        type: Sequelize.ENUM("Home", "Draw", "Away"),
        allowNull: false,
      },
      bet_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      potential_win: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Placed", "Won", "Lost"),
        allowNull: false,
        defaultValue: "Placed",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "events",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bets");
  },
};
