import mongoose, { Document, Model } from "mongoose";
import { IUser } from "./user";

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		text: true,
	},
	header_img: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	createdOn: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updatedOn: {
		type: Date,
		default: Date.now,
		required: true,
	},
	author: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	likes_counter: {
		type: Number,
		default: 0,
	},
	comments_counter: {
		type: Number,
		default: 0,
	},
	tags: [String],
});

export interface IShortPost {
	_id: string;
	title: string;
	header_img?: string;
	tags: string[];
	updatedOn: string;
	createdOn: string;
	likes_counter: string;
	comments_counter: string;
	author: IUser;
}
export interface IPost {
	_id: string;
	title: string;
	markdown: string;
	header_img?: string;
	tags: string[];
	updatedOn: string;
	createdOn: string;
	likes_counter: string;
	comments_counter: string;
	author: IUser;
}

const post = mongoose.models.post || mongoose.model("post", postSchema);

export default post;
