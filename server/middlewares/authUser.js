const jwt = require("jsonwebtoken");

/** Bearer JWT from mobile auth (OTP / Firebase) */
function authUser(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decoded.userId?.toString?.() || decoded.userId;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authUser;
