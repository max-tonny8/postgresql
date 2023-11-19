const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Bet, Event, Team } = require("../models");

const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email is already in use
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password_hash: password,
      balance: 0.0,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Create token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "2h", // Token expiration time, can be declared as env var
      });

      res.cookie("jwt", token, { httpOnly: true, sameSite: "strict" }); // Set token in a httpOnly cookie
      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get user information
const getSingleUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (req.user && req.user.id !== parseInt(userid)) {
      // the line below to restrict users from accessing others' information
      return res.status(403).json({ message: "Forbidden access" });
    }

    const user = await User.findByPk(userid, {
      attributes: { exclude: ["password_hash"] },
      include: [
        {
          model: Bet,
          as: "bet",
          include: [
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
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      balance: user.balance,
      bets: user.bet || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for user logout
const userLogout = (req, res) => {
  res.clearCookie("jwt"); // Clear the jwt cookie
  res.status(200).json({ message: "User logged out successfully" });
};

//add balance
const userAddBalance = async (req, res) => {
  const { amount } = req.body; // Assuming the amount to add is sent in the request body

  // Check if the amount is a positive number and does not exceed the limit
  if (amount <= 0 || amount > 100) {
    return res.status(400).json({
      message:
        "Invalid amount. You can only add between 1 and 100 to your balance.",
    });
  }

  try {
    // Assuming req.user is already populated by the 'protect' middleware
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the amount to the user's current balance
    user.balance = parseFloat(user.balance) + parseFloat(amount);

    // Save the updated user object
    await user.save();

    // Respond with the new balance
    res.status(200).json({
      message: "Balance updated successfully",
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating balance" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  userAddBalance,
  getSingleUser,
};
