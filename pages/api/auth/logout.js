import withMiddlewares from "../../../middlewares/withMiddlewares";
import withPassport from "../../../middlewares/withPassport";

export default withMiddlewares([withPassport], (req, res) => {
	req.logout();
	res.redirect("/");
});
