/* The code snippet `const jwt = require("jsonwebtoken");` is importing the `jsonwebtoken` library in a
Node.js environment. This library is commonly used for generating and verifying JSON Web Tokens
(JWT) which are used for authentication and authorization purposes in web applications. By importing
`jsonwebtoken`, the code is able to utilize its functions for handling JWT tokens within the `auth`
middleware function. */
//middlewares
const jwt = require("jsonwebtoken");

/* This code snippet is exporting a middleware function named `auth` in a Node.js environment. The
purpose of this middleware function is to handle authentication using JSON Web Tokens (JWT). */
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
