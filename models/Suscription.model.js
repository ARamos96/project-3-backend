const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const suscriptionSchema = new Schema({
    shippingAdress: {
        address: {
            type: String,
            required: [true, "Address is required."],
        },
        city: {
            type: String,
            required: [true, "City is required."],
        },
        region: {
            type: String,
            required: [true, "Region is required."],
        },
        zipCode: {
            type: String,
            required: [true, "ZipCode is required."],
        },
        country: {
            type: String,
            required: [true, "Country is required."],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required."],
        },

    },
    weeklyOrder: { type: Schema.Types.ObjectId, ref: "WeeklyOrder", required: true },

    timestamps: true,

    deliveryDay: {
        type: [String],
        required: [true, "Delivery Day is required"],
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
            "Whatever"
        ]
    },

    paymentMethod: {
        type: Schema.Types.ObjectId, ref: "Payment", required: true
    }

})

const Suscription = model("Suscription", suscriptionSchema);

module.exports = Suscription;