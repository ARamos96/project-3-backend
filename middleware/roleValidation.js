// middleware/roleValidation.js
const roleValidation = (roles) => {
  return (req, res, next) => {
    console.log("YOU´RE IN ROLE VALIDATION");
    /*
if (!req.headers.authorization) {
  return res.status(401).json({
    message: "Unauthorized: No user is logged in or no role is assigned.",
  });
}*/

    console.log("THIS IS THE ROLE HEADERS");
    console.log(Object.keys(req.headers));
    console.log(Object.keys(req.headers).includes("authorization"));

    if (!Object.keys(req.headers).includes("authorization")) {
      return res.status(401).json({
        message: "Unauthorized: No user is logged in or no role is assigned.",
      });
    }
    console.log(req.headers.authorization.startsWith("Bearer"));
    if (!roles.includes(req.payload.role)) {
      return res.status(403).json({
        message:
          "Access forbidden: insufficient rights because the roles required are " +
          roles +
          " while the role in the payload is " +
          req.payload.role,
      });
    }
    next();
  };
};

module.exports = roleValidation;
