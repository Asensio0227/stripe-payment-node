const NotFoundMiddleware = async (req, res) => res.send('Route does not exist');

module.exports = NotFoundMiddleware;