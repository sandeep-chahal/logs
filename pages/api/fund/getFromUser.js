import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Fund from "../../../models/fund";
import { addNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	const funds = await Fund.find({
		user: req.body._id,
	})
		.skip(req.body.skip)
		.limit(req.body.limit || 10);

	return res.json({
		error: false,
		data: {
			funds,
		},
	});
};
