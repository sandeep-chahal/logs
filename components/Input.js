import { useState } from "react";

const Input = ({
	type,
	name,
	setState,
	value,
	err = "",
	disabled = false,
	placeholder = "",
}) => {
	const handleValueChange = (e) => {
		if (setState) setState(e.target.value);
	};

	const getInputEl = () => {
		if (type === "textarea")
			return (
				<textarea
					disabled={disabled}
					value={value}
					className="p-2 border-2"
					value={value}
					onChange={handleValueChange}
					placeholder={placeholder}
				/>
			);
		if (type === "file")
			return (
				<div className="flex items-center">
					<img
						src={value}
						className="w-16 h-16 object-cover object-center rounded-full mr-4"
					/>
					<input
						type="file"
						id={name}
						disabled={disabled}
						onChange={setState}
					/>
				</div>
			);
		return (
			<input
				placeholder={placeholder}
				disabled={disabled}
				value={value}
				className={`${err ? "border-primary" : ""} border-2 p-1`}
				id={name}
				type={type}
				onChange={handleValueChange}
			/>
		);
	};
	return (
		<div className="flex flex-col my-4">
			<label
				htmlFor={name}
				className={`mb-2 text-lg ${err ? "text-primary" : ""}`}
			>
				{name}
				<span className="text-xs ml-4">
					{type === "file" ? "Leave blank if don't want ot update" : ""}
				</span>
			</label>
			{getInputEl()}
			<div
				className={`text-primary mt-1 text-sm font-light ${
					err ? "opacity-100" : "opacity-0"
				} `}
			>
				{err || "Something's Wrong"}
			</div>
		</div>
	);
};

export default Input;
