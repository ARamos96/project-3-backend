const { getTokenFromHeaders } = require("../middleware/jwt.middleware");
const jwt = require("jsonwebtoken");

const subscription = require("../models/Subscription.model");

const roleValidation = (roles, isSameUser) => {
  return (req, res, next) => {
    /*


    or 
    Object.keys(req.headers).includes("authorization")
if (!req.headers.authorization) {
  return res.status(401).json({
    message: "Unauthorized: No user is logged in or no role is assigned.",
  });
}*/

    // If there is no authorization, return error message
    if (!Object.keys(req.headers).includes("authorization")) {
      return res.status(401).json({
        message: "Unauthorized: No user is logged in or no role is assigned.",
      });
    }

    if (!roles.includes(req.payload.role)) {
      return res.status(403).json({
        message:
          "Access forbidden: insufficient rights because the roles required are " +
          roles +
          " while the role in the payload is " +
          req.payload.role,
      });
    }

    // If isSameUser parameter is passed and it equals the following string
    /*
    if (
      isSameUser != undefined &&
      isSameUser.localeCompare("isSameUser") == 0
    ) {
      // Check if id in token payload is same as owner of object requested
      const token = getTokenFromHeaders(req);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET, {
        algorithms: ["HS256"],
      });
      const objectRequested = req.baseUrl.slice(1);
      console.log(JSON.stringify(decoded));
    }
      */
    next();
  };
};

module.exports = roleValidation;
