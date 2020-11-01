import { useState } from "react";
import { handleComment } from "../../utils/fetch/post";

const AddComment = ({ id, setPost, setComments }) => {
	const [comment, setComment] = useState("");
	const [button, setButton] = useState(true);
	return (
		<div className="mb-4">
			<textarea
				onChange={(e) => setComment(e.target.value)}
				id="comment"
				className="block w-full h-24 p-2 border-gray-300 border-2"
				placeholder="What you think?"
			></textarea>
			<button
				onClick={() =>
					comment.trim().length > 10
						? handleComment(id, comment, setComments, setPost, setButton)
						: null
				}
				disabled={!button}
				className="outline-none border-none bg-primary shadow-none px-2 py-1 my-2"
			>
				Comment
			</button>
		</div>
	);
};

export default AddComment;
