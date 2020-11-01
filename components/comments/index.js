import Comment from "./comment";
import AddComment from "./add";

export default ({ comments }) => {
	return (
		<div className="text-black mt-6 bg-white p-4">
			<h2 className="text-xl font-medium mb-2">Comments</h2>
			<AddComment />
			<div>
				{comments.length ? (
					comments.map((comment) => (
						<Comment key={comment._id} comment={comment} />
					))
				) : (
					<div className="text-center">No Comments</div>
				)}
			</div>
		</div>
	);
};
