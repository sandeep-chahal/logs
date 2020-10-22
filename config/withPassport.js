import passport from "passport";
import { GithubStrategy, GoogleStrategy } from "./passportStrategy";
import redirect from "micro-redirect";
import cookieSession from "cookie-session";
import url from "url";

passport.use(GithubStrategy);
passport.use(GoogleStrategy);

passport.serializeUser((user, done) => {
	const { _id, name, photo, email } = user;
	done(null, { _id, name, photo, email });
});
passport.deserializeUser(async (serializedUser, done) => {
	if (!serializedUser) {
		return done(new Error(`User not found: ${serializedUser}`));
	}

	done(null, serializedUser);
});

export default (fn) => (req, res) => {
	if (!res.redirect) {
		res.redirect = (location) => redirect(res, 302, location);
	}
	cookieSession({
		name: "ps",
		keys: [process.env.SS_KEY],
		domain: url.parse(req.url).host,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
	})(req, res, () =>
		passport.initialize()(req, res, () =>
			passport.session()(req, res, () => fn(req, res))
		)
	);
};
