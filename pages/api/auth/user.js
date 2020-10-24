import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";

export default withMiddlewares([withPassport], (req, res) => {
	return res.json(
		req.isAuthenticated() ? { ...req.user, isAuth: true } : { isAuth: false }
	);
});
