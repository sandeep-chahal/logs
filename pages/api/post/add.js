import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";

export default withMiddlewares([withPassport], (req, res) => {
	// if()
});
