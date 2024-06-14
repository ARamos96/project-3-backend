// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

const { isAuthenticated } = require("./middleware/jwt.middleware");
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const dishesRoutes = require("./routes/dishes.routes");
app.use("/dishes", dishesRoutes);

const mealPlanRoutes = require("./routes/mealplan.routes");
app.use("/mealplan", mealPlanRoutes);

const userRoutes = require("./routes/users.routes");
app.use("/user", isAuthenticated, userRoutes);

const subscriptionRoutes = require("./routes/subscription.routes");
app.use("/subscription", subscriptionRoutes);

const addressRoutes = require("./routes/address.routes");
app.use("/address", addressRoutes);

const paymentRoutes = require("./routes/payment.routes");
app.use("/payment", paymentRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
