import withMiddlewares from "../../../middlewares";
import Razorpay from "razorpay";
import User from "../../../models/user";

export default async (req, res) => {
	if (req.method != "POST") return res.end("Only Post Request are accepted!");
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) return res.json(result);
	if (typeof req.body.amount === "number" && req.body.amount < 10)
		return res.json({ error: true, msg: "Amount must be grater then 10" });

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
