import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Fund from "../../../models/fund";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	await Fund.findByIdAndDelete(req.body._id);
	return res.json({
		error: false,
	});
};
