import dayjs from "dayjs";
import Link from "next/link";
import { IShortPost } from "../models/post";

interface IProps {
	post: IShortPost;
}

const Post = ({ post }: IProps) => {
	return (
		<article className="my-4 p-3 rounded hover:bg-white hover:shadow-sm">
			{post.header_img ? (
				<img
					src={post.header_img}
					className="object-cover object-center w-full  h-40 block m-auto mb-4"
					alt={"header image for " + post.title}
				/>
			) : null}
			<Link href={`/post/${post._id}`}>
				<a>
					<h2 className="text-3xl font-extrabold text-gradient-1 hover:text-primary cursor-pointer">
						{post.title}
					</h2>
				</a>
			</Link>

			<div className="flex items-center text-base font-medium text-darkBlue">
				<span className="w-1 h-1 bg-darkBlue rounded block mx-3" />
				{typeof post.author !== "string" ? (
					<Link href={`profile/${post.author._id}`}>
						<a>
							<span className="cursor-pointer hover:underline capitalize">
								{post.author.name}
							</span>
						</a>
					</Link>
				) : (
					<span>{post.author}</span>
				)}
				<span className="w-1 h-1 bg-darkBlue rounded block mx-3" />
				<span>{dayjs(post.updatedOn).format("dddd, MMMM D YYYY")}</span>
			</div>
			<div className="flex my-2">
				{post.tags.map((tag, i) => (
					<div className="text-primary mx-3 font-medium" key={tag + i}>
						#{tag}
					</div>
				))}
			</div>
		</article>
	);
};

export default Post;
