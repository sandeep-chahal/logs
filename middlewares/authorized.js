export default (req, res, next) => {
	if (!req.isAuthenticated()) {
		res.json({
			error: true,
			code: 0,
		});
		next(true);
	} else next();
};
