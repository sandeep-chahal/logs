import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Fund from "../../../models/fund";
import { addNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "3", "valid-id");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	const fund = await Fund.findById(req.body._id).populate({
		path: "user",
		model: User,
		select: "name photo",
	});

	if (fund)
		return res.json({
			error: false,
			data: {
				fund,
			},
		});
	return res.json({
		error: true,
		msg: "Can't find fund by this id",
	});
};
