import mongoose, { Document, Model } from "mongoose";

const followSchema = new mongoose.Schema({
	from: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	to: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

followSchema.index({ from: 1, to: 1 }, { unique: true });
export interface IFollow extends Document {
	from: string;
	to: string;
	date: string;
}
const follow: Model<IFollow> =
	mongoose.models.follow || mongoose.model("follow", followSchema);
export default follow;
