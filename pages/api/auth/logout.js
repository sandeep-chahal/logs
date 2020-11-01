import withMiddlewares from "../../../middlewares/withMiddlewares";
import withPassport from "../../../middlewares/withPassport";

export default async (req, res) => {
	await withMiddlewares(req, res, [withPassport]);
	req.logout();
	res.redirect("/");
};
