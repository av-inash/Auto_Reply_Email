const express = require("express");
const router = express.Router();
const { getAuth } = require("../models/authModel");
const { processUnrepliedMessages } = require("../controllers/mailControllers.js");

router.get("/", async (req, res) => {
  const auth = await getAuth();
  processUnrepliedMessages(auth);

  res.json({ message: "Server is running" });
});

module.exports = router;
