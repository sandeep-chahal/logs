import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		index: true,
	},
	follower_counter: {
		type: Number,
		default: 0,
	},
	following_counter: {
		type: Number,
		default: 0,
	},
	provider: String,
	photo: String,
	title: String,
	summary: String,
	location: String,
	linkedin: String,
	github: String,
	twitter: String,
	web: String,
});

export default mongoose.models.user || mongoose.model("user", userSchema);
