import withMiddlewares from "../../../middlewares";
import { hasNotf } from "../../../services/redis";

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
		if (result.error) {
			return res.json(result);
		}
		const has = await hasNotf(req.user._id);

		res.json({
			error: false,
			data: has,
		});
	} catch (err) {
		console.log("ERROR:");
		console.log(err);
		res.json({
			error: false,
			data: false,
		});
	}
};
