import withMiddlewares from "../../../middlewares";
import Razorpay from "razorpay";
import User from "../../../models/user";

export default async (req, res) => {
	if (req.method != "POST") return res.end("Only Post Request are accepted!");
	const result = await withMiddlewares(req, res, "1 2");
	if (result.error) return res.json(result);

	const instance = new Razorpay({
		key_id: process.env.RAZORPAY_KEY_ID,
		key_secret: process.env.RAZORPAY_KEY_SECRET,
	});
	console.log(req.body.pack);

	instance.orders.create(
		{
			amount: req.body.pack === "12" ? 449 * 100 : 49 * 100,
			currency: "INR",
			receipt: req.user._id,
			notes: req.body.pack === "12" ? "12 Months" : "1 Month",
		},
		(err, order) => {
			if (err) {
				console.log("Razerpay error on order creation:", err);
				res.json({ error: true });
			} else {
				User.findByIdAndUpdate(
					req.user._id,
					{
						subscription: {
							order_details: { ...order, pack: req.body.pack },
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
