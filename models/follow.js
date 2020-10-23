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

export default mongoose.models.follow || mongoose.model("follow", followSchema);
