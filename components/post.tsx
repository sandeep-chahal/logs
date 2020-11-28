import dayjs from "dayjs";
import Link from "next/link";

type Author = {
	name:string;
	_id:string;
}

export interface IPost {
	_id:string;
	title:string;
	header_img:string|null;
	author:string|Author;
	updatedOn:string;
	tags:string[]
}
interface IProps {
	post:IPost
}

const Post = ({ post }:IProps) => {
	return (
		<article className="bg-white my-4 p-3 text-black">
			<Link href={`/post/${post._id}`}>
				<a>
					<h2 className="text-3xl font-extrabold hover:text-primary cursor-pointer">
						{post.title}
					</h2>
				</a>
			</Link>

			<div className="flex items-center text-sm font-light">
				<span className="w-1 h-1 bg-black rounded block mx-3" />
				{typeof post.author !== "string" ? (
					<Link href={`profile/${post.author._id}`}>
						<a>
							<span className="cursor-pointer hover:underline">
								{post.author.name}
							</span>
						</a>
					</Link>
				) : (
					<span>{post.author}</span>
				)}
				<span className="w-1 h-1 bg-black rounded block mx-3" />
				<span>{dayjs(post.updatedOn).format("dddd, MMMM D YYYY")}</span>
			</div>
			<div className="flex my-2">
				{post.tags.map((tag, i) => (
					<div className="text-primary mx-3" key={tag + i}>
						#{tag}
					</div>
				))}
			</div>
		</article>
	);
};

export default Post;
