import withMiddlewares from "../../../middlewares";
import User from "../../../models/user";

export default async (req, res) => {
	await withMiddlewares(req, res, "1");
	if (req.isAuthenticated()) {
		const user = await User.findById(req.user._id);
		return res.json(user);
	} else {
		res.json(null);
	}
};
