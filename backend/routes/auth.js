const express = require("express");
const router = express.Router();

// This object temporarily stores OTPs in the server's memory mapped to the phone number
const otpStore = {};

// ROUTE 1: Generate and Send OTP
router.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  // Generate a random 6-digit dummy OTP
  const dummyOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save the OTP in backend memory
  otpStore[phone] = dummyOtp;

  // Print it to your backend terminal so you can read it!
  console.log(`\n🔑 [NEW LOGIN] Phone: ${phone} | Dummy OTP: ${dummyOtp}\n`);

  res.json({
    success: true,
    message: "OTP generated successfully",
    otp: dummyOtp, // We send it back here just so you can easily show it in a frontend alert for testing!
  });
});

// ROUTE 2: Verify the OTP
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP required" });
  }

  // Check if the OTP matches what we saved in memory
  if (otpStore[phone] === otp) {
    // Delete it from memory so it can't be used twice
    delete otpStore[phone];
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
});

module.exports = router;