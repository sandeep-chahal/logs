import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
	on_post: {
		type: mongoose.Types.ObjectId,
		ref: "Post",
	},
	by_user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

likeSchema.index({ on_post: 1, by_user: 1 }, { unique: true });

export default mongoose.models.like || mongoose.model("like", likeSchema);
