import withPassport from "../../../config/withPassport";

export default withPassport((req, res) => {
	return res.json(
		req.isAuthenticated() ? { ...req.user, isAuth: true } : { isAuth: false }
	);
});
