import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Fund from "../../../models/fund";
import { addNotf } from "../../../services/redis";

export default async (req, res) => {
	console.log("-------------------------------------------");
	const result = await withMiddlewares(req, res, "1 2 3", "update-fund");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	const updated = {};

	if (req.body.title) updated.title = req.body.title;
	if (req.body.summary) updated.summary = req.body.summary;
	if (req.body.total) updated.total = req.body.total;
	if (req.body.img) updated.img = req.body.img;
	if (req.body.deadline) updated.deadline = req.body.deadline;

	await Fund.findByIdAndUpdate(req.body._id, updated);

	return res.json({
		error: false,
		data: {
			_id: req.body._id,
		},
	});
};
