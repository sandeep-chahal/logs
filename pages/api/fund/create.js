import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Fund from "../../../models/fund";
import { addNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "1 2 3", "create-fund");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	const fund = await Fund.create({
		title: req.body.title,
		summary: req.body.summary,
		total: req.body.total,
		img: req.body.img,
		deadline: req.body.deadline,
		user: req.user._id,
	});

	return res.json({
		error: false,
		data: {
			_id: fund._id,
		},
	});
};
