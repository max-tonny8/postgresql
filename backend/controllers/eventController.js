const { Event, Team, Odd } = require("../models");

const getAllEvents = async (req, res) => {
  try {
    // Fetch all events from the database including associated team and odds info
    const events = await Event.findAll({
      include: [
        {
          model: Team,
          as: "HomeTeam",
          attributes: ["id", "team_name", "teamImage"],
        },
        {
          model: Team,
          as: "AwayTeam",
          attributes: ["id", "team_name", "teamImage"],
        },
        {
          model: Odd,
          as: "odds",
          attributes: ["home_odd", "draw_odd", "away_odd"],
        },
      ],
    });

    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getAllEvents };
