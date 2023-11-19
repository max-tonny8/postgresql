const jwt = require("jsonwebtoken");
const db = require("../models");

const { User } = db;

const protect = (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Decode the token and get user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by their primary key (PK) and exclude the password from the result
      User.findByPk(decoded.userId, { attributes: { exclude: ["password"] } })
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((error) => {
          console.error(error);
          res.status(401).json({ message: "Not authorized, token failed" });
        });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
