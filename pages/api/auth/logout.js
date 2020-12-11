import withMiddlewares from "../../../middlewares";

export default async (req, res) => {
	await withMiddlewares(req, res, "1");
	req.logout();
	res.redirect("/");
};
