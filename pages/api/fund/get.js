import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Fund from "../../../models/fund";
import Donation from "../../../models/donation";
import { addNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "3", "valid-id");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	const prom = [];

	prom.push(
		Fund.findById(req.body._id).populate({
			path: "user",
			model: User,
			select: "name photo",
		})
	);

	prom.push(
		Donation.find({ on_fund: req.body._id }).sort({ date: -1 }).limit(5)
	);

	const [fund, donations] = await Promise.all(prom);

	if (fund)
		return res.json({
			error: false,
			data: {
				fund,
				donations,
			},
		});
	return res.json({
		error: true,
		msg: "Can't find fund by this id",
	});
};
