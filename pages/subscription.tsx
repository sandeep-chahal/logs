import React, { useState } from "react";
import { useStore } from "../store";
import { createOrder, displayRazorpay } from "../utils/fetch/subscription";
import { showModal } from "../store/actions";
const Subscription = () => {
	const [state, dispatch] = useStore();
	const [loading, setLoading] = useState(false);

	const handleBuy = async (pack: string) => {
		setLoading(true);
		const result = await createOrder(pack);
		if (result.error) {
			dispatch(
				showModal(true, {
					type: "ERROR",
					msg: result.msg,
				})
			);
		} else
			await displayRazorpay(
				result.order,
				pack,
				state.user,
				(result: { error: boolean; msg: string; redirect: boolean }) => {
					console.log(result);
					if (result.error)
						dispatch(
							showModal(true, {
								type: "ERROR",
								msg: result.msg,
							})
						);
					else {
						dispatch(
							showModal(true, {
								type: "SUCCESS",
								msg: "Success. Login again!",
							})
						);
						window.location.replace("/api/auth/github");
					}
				}
			);
		setLoading(false);
	};
	return (
		<div className="min-h-screen flex flex-col items-center">
			<h1 className="text-center text-2xl font-bold mb-4">Subscription</h1>
			<div className="flex justify-evenly w-1/2 text-white">
				<div className="w-11/12 mx-3 h-full rounded-md bg-gray-200 flex flex-col items-center">
					<div className="bg-primary pt-3 w-full">
						<div className="font-medium text-xl text-center">1 Month</div>
						<div className="flex font-bold justify-center mt-5">
							<span>₹</span>
							<span className="text-6xl">50</span>
						</div>
					</div>

					<div className="flex flex-col items-center text-black font-medium mt-5">
						<span className="mt-3">Unlimited Reading</span>
						<span className="mt-3">Receive Donations</span>
						<span className="mt-3">Start Fund Rasing</span>
					</div>
					<button
						disabled={loading}
						onClick={() => handleBuy("1")}
						className="mt-10 mb-10 hover:bg-secondary bg-primary p-3 block"
					>
						{loading ? "Wait!" : "Purchase"}
					</button>
				</div>
				<div className="w-11/12 mx-3 h-full rounded-md bg-gray-200 flex flex-col items-center">
					<div className="bg-secondary pt-3 w-full">
						<div className="font-medium text-xl text-center">12 Months</div>
						<div className="flex font-bold justify-center mt-5">
							<span>₹</span>
							<span className="text-6xl">449</span>
						</div>
					</div>

					<div className="flex flex-col items-center text-black font-medium mt-5">
						<span className="mt-3">Unlimited Reading</span>
						<span className="mt-3">Receive Donations</span>
						<span className="mt-3">Start Fund Rasing</span>
					</div>
					<button
						disabled={loading}
						onClick={() => handleBuy("12")}
						className="mt-10 mb-10 hover:bg-primary bg-secondary p-3 block"
					>
						{loading ? "Wait!" : "Purchase"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Subscription;
