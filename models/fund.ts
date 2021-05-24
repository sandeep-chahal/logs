import mongoose from "mongoose";

const fundSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User",
		index: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	total: {
		type: Number,
		required: true,
	},
	raised: {
		type: Number,
		default: 0,
	},
	title: {
		type: String,
		required: true,
	},
	summary: {
		type: String,
	},
	img: {
		type: String,
	},
	deadline: {
		type: Date,
		default: Date.now,
	},
});

export interface IFund {
	_id: string;
	user: string;
	date: string;
	total: number;
	raised: number;
	title: string;
	summary: string;
	img: string;
	deadline: string;
}

const fund = mongoose.models.fund || mongoose.model("fund", fundSchema);
export default fund;
