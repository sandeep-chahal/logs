import mongoose, { Document, Model } from "mongoose";
// import { IUser } from "../types";

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

export interface IUser extends Document {
	name: String;
	email: string;
	follower_counter: number;
	following_counter: number;
	provider: String;
	photo: String;
	title?: String;
	summary?: String;
	location?: String;
	linkedin?: String;
	github?: String;
	twitter?: String;
	web?: String;
}

const user: Model<IUser> =
	mongoose.models.user || mongoose.model("user", userSchema);

export default user;
