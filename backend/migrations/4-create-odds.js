"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("odds", {
      odd_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      home_odd: {
        type: Sequelize.NUMERIC(5, 2),
        allowNull: false,
      },
      draw_odd: {
        type: Sequelize.NUMERIC(5, 2),
        allowNull: false,
      },
      away_odd: {
        type: Sequelize.NUMERIC(5, 2),
        allowNull: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("odds");
  },
};
