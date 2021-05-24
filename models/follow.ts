import mongoose from "mongoose";

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
export interface IFollow {
	_id: string;
	from: string;
	to: string;
	date: string;
}
const follow = mongoose.models.follow || mongoose.model("follow", followSchema);
export default follow;
