import Comment from "./comment";
import AddComment from "./add";
import { handleDeleteComment, loadMoreComments } from "../../utils/fetch/post";
import { useState } from "react";
import { useStore } from "../../store";

export default ({ id, comments, post, setPost, setComments }) => {
	let [{ user }] = useStore();
	let [loadMore, setLoadMore] = useState(false);
	let [moreError, setMoreError] = useState(false);

	const deleteComment = (id, setBtnDisable) => {
		handleDeleteComment(id, setBtnDisable, setComments, setPost);
	};
	const handleMoreComments = () => {
		loadMoreComments(
			post._id,
			comments.length,
			setLoadMore,
			setMoreError,
			setComments
		);
	};
	return (
		<div className="text-darkBlue mt-6 bg-white p-4">
			<h2 className="text-xl font-medium mb-2">Comments</h2>
			<AddComment id={id} setPost={setPost} setComments={setComments} />
			<div>
				{comments.length ? (
					comments
						.reverse()
						.map((comment) => (
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
				{comments.length < post.comments_counter && !moreError ? (
					<button
						onClick={handleMoreComments}
						disabled={loadMore}
						className="bg-gradient-1 px-3 py-1 m-auto block"
					>
						{loadMore ? "Wait" : "More"}
					</button>
				) : null}
				{moreError && (
					<div className="text-center text-primary my-3">{moreError}</div>
				)}
			</div>
		</div>
	);
};
