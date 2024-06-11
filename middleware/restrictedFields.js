const restrictedFields = (fields) => {
  return (req, res, next) => {
    if (
      fields.some((key) => Object.keys(req.body).includes(key)) &&
      req.payload.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
};

module.exports = restrictedFields;
