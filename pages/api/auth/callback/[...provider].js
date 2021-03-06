import withMiddlewares from "../../../../middlewares";
import { STRATEGIES } from "../../../../config/passportStrategy";
import passport from "passport";

export default async (req, res) => {
	// if provider is not available then redirect to homepage
	if (!(req.query.provider in STRATEGIES)) return res.redirect("/");

	await withMiddlewares(req, res, "1");

	passport.authenticate(req.query.provider)(req, res, (err) => {
		if (err) {
			console.log(err);
			if (err.code === "bad_verification_code")
				return res.redirect("/?error_code=invalid_auth_code");
			return res.redirect("/?error_code=unknown");
		}
		return res.redirect("/auth/user");
	});
};
