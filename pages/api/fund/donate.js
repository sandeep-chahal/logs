import withMiddlewares from "../../../middlewares";
import Razorpay from "razorpay";
import User from "../../../models/user";
import Fund from "../../../models/fund";

export default async (req, res) => {
	if (req.method != "POST") return res.end("Only Post Request are accepted!");
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) return res.json(result);
	if (typeof req.body.amount === "number" && req.body.amount < 10)
		return res.json({ error: true, msg: "Amount must be grater then 10" });

	// check if fund exist
	const fund = await Fund.findById(req.body.onFund);
	if (!fund)
		return res.json({
			error: true,
			msg: "Fund doesn't exist!",
		});

	const instance = new Razorpay({
		key_id: process.env.RAZORPAY_KEY_ID,
		key_secret: process.env.RAZORPAY_KEY_SECRET,
	});

	instance.orders.create(
		{
			amount: Number(req.body.amount) * 100,
			currency: "INR",
			receipt: req.user._id,
		},
		(err, order) => {
			if (err) {
				console.log("Razerpay error on order creation:", err);
				res.json({ error: true, msg: err.error.description });
			} else {
				User.findByIdAndUpdate(
					req.user._id,
					{
						$set: {
							activeDonation: {
								id: order.id,
								on_fund: req.body.onFund,
								fund_title: fund.title,
								fund_user: fund.user,
								amount: Number(req.body.amount),
								msg: req.body.msg,
							},
						},
					},
					(err, doc) => {
						if (err) res.json({ error: true });
						res.json({ error: false, order });
					}
				);
			}
		}
	);
};
