import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	on_post: {
		type: mongoose.Types.ObjectId,
		ref: "Post",
		index: true,
		unique: false,
	},
	by_user: {
		_id: { type: mongoose.Types.ObjectId },
		name: String,
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

commentSchema.index({ on_post: 1, by_user: 1 }, { unique: false });

export interface IComment {
	_id: string;
	on_post: string;
	by_user: string;
	content: string;
	date: string;
}

const follow =
	mongoose.models.comment || mongoose.model("comment", commentSchema);

export default follow;
