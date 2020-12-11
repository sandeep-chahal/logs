import withMiddlewares from "../../../middlewares";
import { getNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) {
		return res.json(result);
	}
	const notf = await getNotf(req.user._id);

	res.json({
		error: false,
		data: notf,
	});
};
