import dayjs from "dayjs";
import Link from "next/link";

const UserPost = ({ post, author }) => {
	return (
		<Link href={`/post/${post._id}`}>
			<div className="bg-pureWhite p-4 mb-4 cursor-pointer">
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
						<img className="w-4 mr-1" alt="comments" src="/icons/comment.svg" />
						<div>{post.comments_counter}</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default UserPost;
