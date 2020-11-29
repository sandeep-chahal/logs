import mongoose, { Document, Model } from "mongoose";

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

export interface ILike extends Document {
	on_post: string;
	by_user: string;
	date: string;
}

const like: Model<ILike> =
	mongoose.models.like || mongoose.model("like", likeSchema);

export default like;
