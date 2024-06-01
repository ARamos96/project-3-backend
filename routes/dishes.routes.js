const express = require("express");
const router = express.Router();

const Dish = require("../models/Dish.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/", (req, res, next) => {
  Dish.create(req.body)
    .then((newDish) => {
      res.json(newDish);
    })
    .catch((err) => next(err));
});

module.exports = router;
