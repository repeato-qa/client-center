export const ensureAuthenticated = (req, res, next) =>
  req.isAuthenticated() ? next() : res.status(401).end();
