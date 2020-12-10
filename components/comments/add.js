import { useState } from "react";
import { handleComment } from "../../utils/fetch/post";

const AddComment = ({ id, setPost, setComments }) => {
	const [comment, setComment] = useState("");
	const [button, setButton] = useState(true);

	const addComment = () => {
		if (!button) return;
		if (comment.trim().length > 1)
			handleComment(id, comment, setComments, setPost, setButton);
	};

	return (
		<div className="mb-4">
			<textarea
				onChange={(e) => setComment(e.target.value)}
				id="comment"
				className="block w-full h-24 p-2 border-gray-300 border-2 border-dashed outline-none focus:border-secondary transition-1"
				placeholder="What you think?"
			></textarea>
			<button
				onClick={addComment}
				disabled={!button}
				className="outline-none border-none bg-gradient-1 text-white shadow-none px-2 py-1 my-2"
			>
				Comment
			</button>
		</div>
	);
};

export default AddComment;
