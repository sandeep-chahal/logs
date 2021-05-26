import _GithubStrategy from "passport-github";
import _GoogleStrategy from "passport-google-oauth2";
import dbConnect from "./mongodb";
import User from "../models/user";

export const STRATEGIES = { github: true, google: true };

const callbackHandler = async (accessToken, refreshToken, profile, cb) => {
	try {
		// connect to db
		await dbConnect();

		console.log(profile);

		// get the user profile
		const name = profile.displayName || profile.username || "Unknown";
		const email = profile.emails ? profile.emails[0].value : profile.username;
		const photo = profile.photos ? profile.photos[0].value : "";
		const provider = profile.provider;

		// get or create user
		let user = await User.findOne({ email });
		if (!user) user = await User.create({ name, email, photo, provider });

		cb(null, user);
	} catch (err) {
		console.log(err);
		cb(err.message, null);
	}
};

export const GithubStrategy = new _GithubStrategy(
	{
		passReqToCallback: false,
		clientID: process.env.GITHUB_CLIENTID,
		clientSecret: process.env.GITHUB_CLIENTSECRET,
		callbackURL: process.env.GITHUB_CB_URL,
		scope: "user:email",
	},
	callbackHandler
);
// export const GoogleStrategy = new _GoogleStrategy(
// 	{
// 		passReqToCallback: false,
// 		clientID: process.env.Google_CLIENTID,
// 		clientSecret: process.env.Google_CLIENTSECRET,
// 		callbackURL: `/api/auth/callback/google`,
// 		scope: "user:email",
// 	},
// 	callbackHandler
// );
