import { useState } from "react";

interface IProps {
	tags: string[];
	setTags: (k: (prev: string[]) => string[]) => void;
	availTags: string[];
	max?: number;
	className: string;
	disabled: boolean;
}

const TagSelector = ({
	tags,
	setTags,
	availTags = [],
	max = Infinity,
	className,
	disabled,
}: IProps) => {
	const handleRemoveTag = (tag: string) => {
		if (disabled) return;
		setTags((prev) => prev.filter((t) => t !== tag));
	};
	const handleTagSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const tag = e.target.value;
		console.log(tag);
		if (!tag.trim() || tag === "select") return;
		setTags((prev) => [...prev, tag.trim()]);
		e.target.value = "select";
	};

	return (
		<div className={className}>
			<h4 className="mr-2">Tags:</h4>
			{tags.map((tag) => (
				<div
					key={tag}
					className="text-primary mx-3 cursor-pointer"
					title="click to remove"
					onClick={() => handleRemoveTag(tag)}
				>
					#{tag}
				</div>
			))}
			{tags.length < availTags.length || max < tags.length ? (
				<select
					disabled={disabled}
					onChange={handleTagSelected}
					className="p-2 border-2 border-black rounded"
					defaultValue="select"
				>
					<option value="select">select</option>
					{availTags
						.filter((t) => !tags.includes(t))
						.map((t) => (
							<option key={t} value={t}>
								#{t}
							</option>
						))}
				</select>
			) : null}
		</div>
	);
};

export default TagSelector;
