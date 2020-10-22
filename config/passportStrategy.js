import _GithubStrategy from "passport-github";
import _GoogleStrategy from "passport-google-oauth2";
import dbConnect from "./mongodb";
import User from "../models/user";

export const STRATEGIES = { github: true, google: true };

const callbackHandler = async (accessToken, refreshToken, profile, cb) => {
	try {
		// connect to db
		await dbConnect();

		// get the user profile
		const name = profile.displayName;
		const email = profile.emails[0].value;
		const photo = profile.photos[0].value;
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
		callbackURL: `/api/auth/callback/github`,
		scope: "user:email",
	},
	callbackHandler
);
export const GoogleStrategy = new _GoogleStrategy(
	{
		passReqToCallback: false,
		clientID: process.env.Google_CLIENTID,
		clientSecret: process.env.Google_CLIENTSECRET,
		callbackURL: `/api/auth/callback/google`,
		scope: "user:email",
	},
	callbackHandler
);
