import dayjs from "dayjs";
import Link from "next/link";

const UserPost = ({ post, author, me, deleting, handleDeletePost }) => {
	return (
		<div
			className={`bg-pureWhite p-4 mb-4 cursor-pointer flex justify-between ${
				deleting && "opacity-50"
			}`}
			title={
				deleting
					? "this post is being deleted"
					: "click on it to view full post"
			}
		>
			<Link href={deleting ? "#" : `/post/${post._id}`}>
				<div>
					<h2 className="text-2xl font-bold">{post.title}</h2>
					<div>{dayjs(post.updatedOn).format("dddd, MMMM D YYYY")}</div>
					<div className="font-light flex">
						<div className="mr-4">{author.name}</div>
						<div className="flex mr-4">
							<img
								className="w-4 pb-1 mr-1"
								alt="likes"
								src="/icons/like-light.svg"
							/>
							<div>{post.likes_counter}</div>
						</div>
						<div className="flex">
							<img
								className="w-4 mr-1"
								alt="comments"
								src="/icons/comment.svg"
							/>
							<div>{post.comments_counter}</div>
						</div>
					</div>
				</div>
			</Link>
			{me ? (
				<div className="flex items-start">
					<Link href={deleting ? "#" : `/post/edit/${post._id}`}>
						<img
							alt="edit post"
							src="/icons/edit.svg"
							className="w-4 mr-4"
							title="edit this post"
						/>
					</Link>
					<img
						alt="delete post"
						src="/icons/delete-bin.svg"
						className="w-4"
						title="delete this post"
						onClick={() => (deleting ? null : handleDeletePost(post._id))}
					/>
				</div>
			) : null}
		</div>
	);
};

export default UserPost;
