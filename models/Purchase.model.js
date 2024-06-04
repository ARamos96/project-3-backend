const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  numberOfPeople: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  numberOfServings: {
    type: Number,
    enum: [2, 3, 4, 5],
  },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;