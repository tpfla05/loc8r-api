const express = require("express");
const router = express.Router();
const axios = require("axios");
const { expressjwt: jwt } = require("express-jwt");

const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "req.auth",
});

const ctrlLocations = require("../controllers/locations");
const ctrlReviews = require("../controllers/reviews");
const ctrlAuth = require("../controllers/authentication");

// --------------------
// Kakao Local API Route
// --------------------
router.get("/kakao/search", async (req, res) => {
  try {
    const { query, x, y, radius } = req.query;

    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json",
      {
        params: { query, x, y, radius, sort: "distance" },
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Kakao API Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Kakao API request failed" });
  }
});

// --------------------
// Locations
// --------------------
router
  .route("/locations")
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route("/locations/:locationid")
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

// --------------------
// Reviews
// --------------------
router
  .route("/locations/:locationid/reviews")
  .post(auth, ctrlReviews.reviewsCreate);

router
  .route("/locations/:locationid/reviews/:reviewid")
  .get(ctrlReviews.reviewsReadOne)
  .put(auth, ctrlReviews.reviewsUpdateOne)
  .delete(auth, ctrlReviews.reviewsDeleteOne);

// --------------------
// Auth
// --------------------
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

module.exports = router;
