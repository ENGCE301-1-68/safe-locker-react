// backend/middlewares/authMiddleware.js
function isAdminLoggedIn(req, res, next) {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { isAdminLoggedIn };
