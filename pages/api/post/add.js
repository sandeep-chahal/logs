import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import authorized from "../../../middlewares/authorized";

export default withMiddlewares([withPassport, authorized], (req, res) => {
	// if()
	res.json({ error: false });
});
