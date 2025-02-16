const express = require("express");
const { googleAuthHandler } = require("./googleAuth");
const router = express.Router();

// Google login (Frontend sends token, backend verifies)
router.post("/google", googleAuthHandler);

// Logout (Clears token)
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
