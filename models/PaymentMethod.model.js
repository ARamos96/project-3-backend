const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
    method:{
        type: String,
        required: true,
        enum: ["Credit Card", "Debit Card"]
    },
    number:{
        type: String,
        required: true,
        trim: true,
        minlength: 16,
        maxlength: 16
    },
    expiration:{
    
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 5
    },
    CVV: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 3
    },
    
});

const Payment = model("Payment", PaymentSchema);
module.exports = {Payment, PaymentSchema};

