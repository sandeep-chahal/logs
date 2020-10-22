import withPassport from "../../../config/withPassport";
import { STRATEGIES } from "../../../config/passportStrategy";
import passport from "passport";

export default withPassport((req, res) => {
	// if provider is not available then redirect to homepage
	if (!(req.query.provider in STRATEGIES)) return res.redirect("/");
	else {
		passport.authenticate(req.query.provider)(req, res, (err) => {
			console.log("got it");
			console.log(err);
		});
	}
});
