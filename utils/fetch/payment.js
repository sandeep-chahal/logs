export const createOrder = async (pack) => {
	const res = await fetch("/api/subscription/createOrder", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			pack,
		}),
	});
	const result = await res.json();
	return result;
};

export const createDonation = async (amount, msg, fundId) => {
	const res = await fetch("/api/fund/donate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount,
			onFund: fundId,
			msg,
		}),
	});
	const result = await res.json();
	return result;
};

const loadScript = async (src) => {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = () => {
			resolve(true);
		};
		script.onerror = () => {
			resolve(false);
		};
		document.body.appendChild(script);
	});
};

export const displayRazorpayDonation = async (order, user, cb) => {
	const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

	if (!res) {
		alert("Razorpay SDK failed to load. Are you online?");
		return;
	}

	// Getting the order details back
	const { amount, id: order_id, currency } = order;

	const options = {
		key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
		amount: amount.toString(),
		currency: currency,
		name: "DevLogs Funds",
		description: `Donate`,
		// image: { logo },
		order_id: order_id,
		handler: async function (response) {
			const data = {
				razorpayPaymentId: response.razorpay_payment_id,
				razorpayOrderId: response.razorpay_order_id,
				razorpaySignature: response.razorpay_signature,
			};

			const result = await fetch("/api/fund/success", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			cb(result);
		},
		prefill: {
			name: user.name,
			email: user.email,
		},
		theme: {
			color: "#8338ec",
		},
	};

	const paymentObject = new window.Razorpay(options);
	paymentObject.open();
};

export const displayRazorpay = async (order, pack, user, cb) => {
	const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

	if (!res) {
		alert("Razorpay SDK failed to load. Are you online?");
		return;
	}

	// Getting the order details back
	const { amount, id: order_id, currency } = order;

	const options = {
		key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
		amount: amount.toString(),
		currency: currency,
		name: "DevLogs Subscription",
		description: `${pack} Month devLogs subscription`,
		// image: { logo },
		order_id: order_id,
		handler: async function (response) {
			const data = {
				razorpayPaymentId: response.razorpay_payment_id,
				razorpayOrderId: response.razorpay_order_id,
				razorpaySignature: response.razorpay_signature,
			};

			const result = await fetch("/api/subscription/success", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			cb(result);
		},
		prefill: {
			name: user.name,
			email: user.email,
		},
		// notes: {
		// 	address: "Soumya Dey Corporate Office",
		// },
		theme: {
			color: "#8338ec",
		},
	};

	const paymentObject = new window.Razorpay(options);
	paymentObject.open();
};
