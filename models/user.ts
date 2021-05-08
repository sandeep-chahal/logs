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
	subscription:{
		expiresOn:Date,	
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

export interface IUser {
	_id: string;
	name: string;
	email: string;
	follower_counter: number;
	following_counter: number;
	provider: string;
	photo: string;
	title?: string;
	summary?: string;
	location?: string;
	linkedin?: string;
	github?: string;
	twitter?: string;
	web?: string;
	expiresOn?: string;
	subscription:{
		expiresOn:Date,
		
	}
}

const user = mongoose.models.user || mongoose.model("user", userSchema);

export default user;
