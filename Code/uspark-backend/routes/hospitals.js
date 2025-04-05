require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors()); // Enable CORS for frontend requests

/**
 * @swagger
 * tags:
 *   - name: Hospitals
 *     description: Endpoints for fetching nearby hospitals
 */

/**
 * @swagger
 * /api/hospitals:
     description: Failed to fetch hospitals
 */

router.get("/", async (req, res) => {
  const { lat, long } = req.query;
  console.log(lat, long);
  if (!lat || !long) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=5000&type=hospital&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const search = req.query.search?.toLowerCase() || "";
    const filteredResults = data.results.filter((h) =>
      h.name.toLowerCase().includes(search)
    );
    res.json({ results: filteredResults });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

module.exports = router;
