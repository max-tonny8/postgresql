"use strict";

const events = [
  {
    eventDate: new Date("2023-12-01T20:00:00Z"),
    eventEndDate: new Date("2023-12-01T22:00:00Z"),
    status: "Active",
    homeTeamId: 1,
    awayTeamId: 2,
  },
  {
    eventDate: new Date("2023-12-02T20:00:00Z"),
    eventEndDate: new Date("2023-12-02T22:00:00Z"),
    status: "Active",
    homeTeamId: 3,
    awayTeamId: 4,
  },
  {
    eventDate: new Date("2023-12-03T20:00:00Z"),
    eventEndDate: new Date("2023-12-01T22:00:00Z"),
    status: "Active",
    homeTeamId: 5,
    awayTeamId: 6,
  },
  {
    eventDate: new Date("2023-12-04T20:00:00Z"),
    eventEndDate: new Date("2023-12-02T22:00:00Z"),
    status: "Active",
    homeTeamId: 7,
    awayTeamId: 8,
  },
  {
    eventDate: new Date("2023-12-05T20:00:00Z"),
    eventEndDate: new Date("2023-12-02T22:00:00Z"),
    status: "Active",
    homeTeamId: 9,
    awayTeamId: 10,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert events into the database
    await queryInterface.bulkInsert(
      "events",
      events.map((event) => ({
        event_date: event.eventDate,
        event_end_date: event.eventEndDate,
        status: event.status,
        homeTeamId: event.homeTeamId,
        awayTeamId: event.awayTeamId,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove all events from the database
    await queryInterface.bulkDelete("events", null, {});
  },
};
