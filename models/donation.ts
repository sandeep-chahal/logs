import mongoose, { Document, Model } from "mongoose";

const donationSchema = new mongoose.Schema({
	on_fund: {
		type: mongoose.Types.ObjectId,
		ref: "Fund",
		index: true,
		unique: false,
	},
	user_name: String,
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		index: true,
		unique: false,
	},
	msg: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	amount: {
		type: Number,
		required: true,
	},
});

donationSchema.index({ on_post: 1, by_user: 1 }, { unique: false });

export interface IDonation {
	_id: string;
	on_fund: string;
	user_id: string;
	user_name: string;
	msg: string;
	date: string;
	amount: number;
}

const donation =
	mongoose.models.donation || mongoose.model("donation", donationSchema);

export default donation;
