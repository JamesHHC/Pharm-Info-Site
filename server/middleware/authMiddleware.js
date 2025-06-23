const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).send('Missing token');

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	}
	catch (err) {
		res.status(403).send('Invalid token');
	}
};

module.exports = { authenticate };