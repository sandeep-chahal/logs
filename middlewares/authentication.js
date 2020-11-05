export default (req, res) => {
	if (!req.isAuthenticated()) {
		return { error: true, code: 101, msg: "You are not logged in." };
	}
	return false;
};
