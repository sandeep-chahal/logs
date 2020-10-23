import mongoose from "mongoose";

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

export default mongoose.models.post || mongoose.model("post", postSchema);
