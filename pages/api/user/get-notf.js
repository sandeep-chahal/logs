import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import { getNotf } from "../../../services/redis";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
		withValidation("valid-id"),
	]);
	if (result.error) {
		return res.json(result);
	}
	const notf = await getNotf(req.user._id);

	res.json({
		error: false,
		data: notf,
	});
};
