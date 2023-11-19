"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "odds",
      [
        {
          odd_id: 1,
          home_odd: 1.95,
          draw_odd: 3.4,
          away_odd: 4.2,
          event_id: "1",
        },
        {
          odd_id: 2,
          home_odd: 2.1,
          draw_odd: 3.25,
          away_odd: 3.75,
          event_id: "2",
        },
        {
          odd_id: 3,
          home_odd: 1.7,
          draw_odd: 3.5,
          away_odd: 5.0,
          event_id: "3",
        },
        {
          odd_id: 4,
          home_odd: 1.85,
          draw_odd: 3.3,
          away_odd: 4.5,
          event_id: "4",
        },
        {
          odd_id: 5,
          home_odd: 2.0,
          draw_odd: 3.6,
          away_odd: 3.9,
          event_id: "5",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("odds", null, {});
  },
};
