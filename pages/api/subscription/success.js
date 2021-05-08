import withMiddlewares from "../../../middlewares";
import crypto from "crypto";
import User from "../../../models/user";

export default async (req, res) => {
	if (req.method != "POST") return res.end("Only Post Request are accepted!");
	const result = await withMiddlewares(req, res, "1 2");
	if (result.error) return res.json(result);

	try {
		// getting the details back from our font-end
		const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
		console.log(req.body);
		// Creating our own digest
		// The format should be like this:
		// digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
		const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

		shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);

		const digest = shasum.digest("hex");

		// comaparing our digest with the actual signature
		if (digest !== razorpaySignature)
			return res
				.status(400)
				.json({ error: true, msg: "Transaction not legit!" });

		// THE PAYMENT IS LEGIT & VERIFIED
		// YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

		const { subscription } = await User.findById(req.user._id).select(
			"subscription"
		);

		// check if orders are same
		if (subscription.order_details.id === razorpayOrderId) {
			// legit
			const time = new Date();
			time.setDate(
				time.getDate() + (subscription.order_details.pack === "12" ? 365 : 30)
			);
			console.log(time);

			// update user with new expire date of subscription
			User.findByIdAndUpdate(
				req.user._id,
				{
					subscription: {
						expiresOn: time,
						order_details: {},
					},
				},
				(err, doc) => {
					if (err) {
						console.log(err);
						res.json({
							error: true,
							msg: `Your transaction was successful but database error occurred. Order id: ${razorpayOrderId}, paymentId: ${razorpayPaymentId}`,
						});
					} else {
						// req.logout();
						res.json({
							error: false,
							redirect: true,
						});
					}
				}
			);
		} else {
			console.log("Order id's doesn't match");
			res.json({
				error: true,
				msg: "Don't place another order while one is in process.",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: true,
			msg: "Something went wrong!",
		});
	}
};
