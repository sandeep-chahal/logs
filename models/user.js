import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		index: true,
	},
	provider: String,
	photo: String,
});

export default mongoose.models.user || mongoose.model("user", userSchema);
