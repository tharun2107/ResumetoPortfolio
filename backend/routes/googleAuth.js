const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload(); // Extracts Google user info
  } catch (error) {
    console.error("Google token verification failed:", error);
    return null;
  }
};

const googleAuthHandler = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const googleUser = await verifyGoogleToken(token);

    if (!googleUser) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    // Check if user exists in DB, otherwise create new one
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        googleId: googleUser.sub, // Google user ID
        name: googleUser.name,
        email: googleUser.email,
        profilePic: googleUser.picture,
      });

      await user.save();
    }

    // Generate JWT token for user session
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token: authToken,
      user: { name: user.name, email: user.email, profilePic: user.profilePic },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { googleAuthHandler };
