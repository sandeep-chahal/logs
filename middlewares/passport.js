import passport from "passport";
import { GithubStrategy, GoogleStrategy } from "../config/passportStrategy";
import cookieSession from "cookie-session";
import url from "url";

passport.use(GithubStrategy);
passport.use(GoogleStrategy);

passport.serializeUser((user, done) => {
	const { _id, name, photo, email } = user;
	done(null, {
		_id,
		name,
		photo,
		email,
		expiresOn: Date.now() + 24 * 60 * 60 * 1000,
	});
});
passport.deserializeUser(async (serializedUser, done) => {
	if (!serializedUser) {
		return done(new Error(`User not found: ${serializedUser}`));
	}

	done(null, serializedUser);
});

export default (req, res) => {
	return new Promise((resolve) => {
		cookieSession({
			name: "ps",
			keys: [process.env.SS_KEY],
			domain: url.parse(req.url).host,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		})(req, res, () =>
			passport.initialize()(req, res, () =>
				passport.session()(req, res, () => resolve(false))
			)
		);
	});
};
