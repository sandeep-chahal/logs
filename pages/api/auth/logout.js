import { withMiddlewares, withPassport } from "../../../middlewares";

export default async (req, res) => {
	await withMiddlewares(req, res, [withPassport]);
	req.logout();
	res.redirect("/");
};
