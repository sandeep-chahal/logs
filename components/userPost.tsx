import dayjs from "dayjs";
import Link from "next/link";
import { IShortPost } from "../models/post";
import { IUser } from "../models/user";

interface IProps {
	post: IShortPost;
	author: IUser;
	me: boolean;
	deleting: boolean;
	handleDeletePost: (id: string) => void;
}

const UserPost = ({ post, author, me, deleting, handleDeletePost }: IProps) => {
	return (
		<div
			className={`bg-white p-1 md:p-4 mb-4 cursor-pointer flex md:flex-row flex-col justify-between ${
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
					<h2 className="text-xl md:text-2xl font-bold">{post.title}</h2>
					<div>{dayjs(post.updatedOn).format("dddd, MMMM D YYYY")}</div>
					<div className="flex font-medium">
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
					{/* edit */}
					<Link href={deleting ? "#" : `/post/edit/${post._id}`}>
						<a>
							<img
								alt="edit post"
								src="/icons/edit.svg"
								className="w-4 mr-4 hidden md:block"
								title="edit this post"
							/>
							<span className="mr-2 md:hidden">Edit</span>
						</a>
					</Link>
					{/* delete */}
					<div onClick={() => (deleting ? null : handleDeletePost(post._id))}>
						<img
							alt="delete post"
							src="/icons/delete-bin.svg"
							className="w-4 hidden md:block"
							title="delete this post"
						/>
						<span className="mr-2 md:hidden">Delete</span>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default UserPost;
