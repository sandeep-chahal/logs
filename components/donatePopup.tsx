import React, { useState } from "react";

interface IProps {
	onDonate: (amount: number, msg: string) => void;
	close: () => void;
}

const DonatePopup = ({ onDonate, close }: IProps) => {
	const [amount, setAmount] = useState(0);
	const [msg, setMsg] = useState("");
	return (
		<div className="bg-gray-100 shadow-sm mt-4 flex flex-col p-4">
			<label>Amount</label>
			<input
				type="number"
				className="border-2"
				onChange={(e) => setAmount(Number(e.target.value))}
			/>
			<label>Message (optional)</label>
			<textarea
				className="border-2"
				onChange={(e) => setMsg(e.target.value)}
				value={msg}
			/>
			<div className="w-full mt-4 flex justify-evenly">
				<button
					className="py-2 px-4 bg-primary text-white"
					onClick={() => onDonate(amount, msg)}
				>
					Donate
				</button>
				<button className="py-2 px-4 bg-primary text-white" onClick={close}>
					Close
				</button>
			</div>
		</div>
	);
};

export default DonatePopup;
