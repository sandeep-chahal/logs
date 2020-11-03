import { useState } from "react";

const TagSelector = ({ tags, setTags, availTags = [], max, className }) => {
	const handleRemoveTag = (tag) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};
	const handleTagSelected = (e) => {
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
					onChange={handleTagSelected}
					className="p-2"
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
