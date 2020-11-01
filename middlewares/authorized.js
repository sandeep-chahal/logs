export default (req, res) => {
	if (!req.isAuthenticated()) {
		res.json({
			error: true,
			code: 0,
		});
		return false;
	}
	return true;
};
