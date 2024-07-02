const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      // Get the encoded token string and return it
      const token = req.headers.authorization.split(" ")[1];
      return token;
    }
  } catch (error) {
    console.error("Error extracting token from headers:", error);
    return null; // Return null if token extraction fails. This will prevent the request from being processed further.  // You might want to return a more specific error response here.
  }
}

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  getTokenFromHeaders,
};
