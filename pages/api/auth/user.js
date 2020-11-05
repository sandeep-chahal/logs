import { withMiddlewares, withPassport } from "../../../middlewares";

export default async (req, res) => {
	await withMiddlewares(req, res, [withPassport]);
	return res.json(req.isAuthenticated() ? { ...req.user, isAuth: true } : null);
};
