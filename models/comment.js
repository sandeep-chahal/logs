import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	on_post: {
		type: mongoose.Types.ObjectId,
		ref: "Post",
	},
	by_user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
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

export default mongoose.models.comment ||
	mongoose.model("comment", commentSchema);
