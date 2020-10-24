import withPassport from "../../../../middlewares/withPassport";
import withMiddlewares from "../../../../middlewares/withMiddlewares";
import { STRATEGIES } from "../../../../config/passportStrategy";
import passport from "passport";

export default withMiddlewares([withPassport], (req, res) => {
	// if provider is not available then redirect to homepage
	if (!(req.query.provider in STRATEGIES)) return res.redirect("/");
	else {
		passport.authenticate(req.query.provider)(req, res, (err) => {
			if (err) {
				if (err.code === "bad_verification_code")
					return res.redirect("/?error_code=invalid_auth_code");
				return res.redirect("/?error_code=unknown");
			}
			return res.redirect("/auth/user");
		});
	}
});
