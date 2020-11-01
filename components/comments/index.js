import Comment from "./comment";
import AddComment from "./add";
import { getUser } from "../../utils";
import { handleDeleteComment } from "../../utils/fetch/post";
import { useEffect, useState } from "react";

export default ({ id, comments, setPost, setComments }) => {
	let [user, setUser] = useState(null);
	useEffect(() => {
		setUser(getUser());
	}, []);

	const deleteComment = (id, setBtnDisable) => {
		handleDeleteComment(id, setBtnDisable, setComments, setPost);
	};
	return (
		<div className="text-black mt-6 bg-white p-4">
			<h2 className="text-xl font-medium mb-2">Comments</h2>
			<AddComment id={id} setPost={setPost} setComments={setComments} />
			<div>
				{comments.length ? (
					comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							userId={user ? user._id : null}
							deleteComment={deleteComment}
						/>
					))
				) : (
					<div className="text-center">No Comments</div>
				)}
			</div>
		</div>
	);
};
