const { User, Bet, Odd, Team, Event } = require("../models");

const createBet = async (req, res) => {
  const { event_id, bet_decision, bet_amount } = req.body;
  const amount = parseFloat(bet_amount);

  // Validate eventId
  const eventIdInt = parseInt(event_id, 10);
  if (isNaN(eventIdInt)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  // Check if the bet amount is within the allowed range
  if (amount <= 0 || amount > 100) {
    return res.status(400).json({ message: "Invalid bet amount" });
  }

  try {
    // Find the user and include the balance
    const user = await User.findByPk(req.user.id);

    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Find the odds for the event
    const odd = await Odd.findOne({
      where: { event_id: eventIdInt },
      include: [
        {
          model: Event,
          as: "event",
          where: { id: eventIdInt },
        },
      ],
    });

    if (!odd) {
      return res.status(404).json({ message: "Odds not found for this event" });
    }

    // Calculate potential win based on the bet type
    let potentialWin;
    switch (bet_decision) {
      case "Home":
        potentialWin = amount * odd.home_odd;
        break;
      case "Draw":
        potentialWin = amount * odd.draw_odd;
        break;
      case "Away":
        potentialWin = amount * odd.away_odd;
        break;
      default:
        return res.status(400).json({ message: "Invalid bet type" });
    }

    // Create the bet
    const bet = await Bet.create({
      bet_decision: bet_decision,
      bet_amount: amount,
      potential_win: potentialWin,
      status: "Placed",
      event_id: event_id,
      user_id: req.user.id,
    });

    // Deduct the bet amount from the user's balance
    user.balance -= amount;
    await user.save();

    res.status(201).json({
      message: "Bet placed successfully",
      bet: {
        id: bet.id,
        bet_decision: bet.bet_decision,
        bet_amount: bet.bet_amount,
        potential_win: bet.potential_win,
        status: bet.status,
        event_id: bet.event_id,
        user_id: bet.user_id,
      },
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while placing the bet" });
  }
};

const deleteBet = async (req, res) => {
  const betId = req.params.betId;

  try {
    // Find the bet with the user and event included
    const bet = await Bet.findByPk(betId, {
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Event,
          as: "event",
          include: [
            {
              model: Team,
              as: "HomeTeam",
            },
            {
              model: Team,
              as: "AwayTeam",
            },
          ],
        },
      ],
    });

    if (!bet) {
      return res.status(404).json({ message: "Bet not found" });
    }

    // Check if the bet belongs to the user making the request
    if (req.user.id !== bet.user_id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own bets" });
    }

    // Ensure that the event is associated with the bet
    if (!bet.event) {
      return res.status(404).json({ message: "Associated event not found" });
    }

    // Check if the event has not started yet
    const currentTime = new Date();
    if (currentTime >= bet.event.event_date) {
      return res
        .status(400)
        .json({ message: "Cannot cancel bet after the event has started" });
    }

    // Refund the bet amount to the user's balance
    const user = await User.findByPk(req.user.id);
    user.balance = parseFloat(user.balance) + parseFloat(bet.bet_amount); // Ensure both balances are treated as numbers
    await user.save();

    // Delete the bet from the database
    await bet.destroy();

    res.status(200).json({
      message: "Bet cancelled and funds have been refunded",
      refundedAmount: bet.bet_amount,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while cancelling the bet" });
  }
};

module.exports = { createBet, deleteBet };
