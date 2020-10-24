import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";

export default withMiddlewares(
	[withPassport, authorized, withValidation("post")],
	(req, res) => {
		return res.json({ error: false });
	}
);
