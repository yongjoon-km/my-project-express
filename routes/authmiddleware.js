const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
	try {
		req.decoded = jwt.verify(req.headers.authorization, 'password');
		return next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(419).json({
				code: 419,
				message: 'token expired',
			});
		}
		return res.status(401).json({
			code: 401,
			message: 'not valid token',
		})
	}
}