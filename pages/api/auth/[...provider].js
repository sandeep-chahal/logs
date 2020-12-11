import withMiddlewares from "../../../middlewares";
import { STRATEGIES } from "../../../config/passportStrategy";
import passport from "passport";

export default async (req, res) => {
	// if provider is not available then redirect to homepage
	if (!(req.query.provider in STRATEGIES)) return res.redirect("/");

	await withMiddlewares(req, res, "1");

	passport.authenticate(req.query.provider)(req, res, (err) => {
		console.log("got it");
		console.log(err);
	});
};
