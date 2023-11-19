const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const db = require("./models"); // Sequelize initialized models
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const betRoutes = require("./routes/bet");

const app = express();
const port = process.env.PORT;

//standart middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//serve static images
app.use("/static/images", express.static("static/images"));

//routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bets", betRoutes);

//some costum middlewares for better error handling
app.use(notFound);
app.use(errorHandler);

// Sync models with the database and then start the server
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
