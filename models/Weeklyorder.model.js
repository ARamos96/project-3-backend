const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const weeklyOrderSchema = new Schema({
    dishesToDeliver: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dish"
        }
    ],
    mealPlan: { Type: Schema.Types.ObjectId,ref: "MealPlan", required: true },
        

});

const WeeklyOrder = model("WeeklyOrder", weeklyOrderSchema);

module.exports = WeeklyOrder

