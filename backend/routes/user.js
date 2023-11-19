const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userLogout,
  getSingleUser,
  userAddBalance,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/logout", userLogout);

router.get("/:userid", protect, getSingleUser);

router.post("/balance", protect, userAddBalance);

module.exports = router;
