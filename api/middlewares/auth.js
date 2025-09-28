/**
 * Authentication middleware using JWT.
 *
 * Validates the presence and validity of a Bearer token.
 */
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized / No autorizado" });
  }

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id; // Attach user ID to request 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token / Token inválido" });
  }
};
