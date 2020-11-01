import getPost from "../../services/getPost";
import withMiddleware from "../../middlewares/withMiddlewares";
import withPassport from "../../middlewares/withPassport";
import withValidation from "../../middlewares/withValidation";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { formatNumber } from "../../utils";
import Comments from "../../components/comments";

const Post = ({ post, liked, comments }) => {
	return (
		<section className="p-6 px-20 ">
			{/* post */}
			<article className="bg-white p-4 text-black">
				{/* title */}
				<h2 className="text-3xl font-extrabold">{post.title}</h2>
				{/* author name , date published */}
				<div className="flex items-center text-sm font-light">
					<span className="w-1 h-1 bg-black rounded block mx-3" />
					<span>{post.author.name}</span>
					<span className="w-1 h-1 bg-black rounded block mx-3" />
					<span>{dayjs(post.updatedOn).format("dddd, MMMM D YYYY")}</span>
				</div>
				{/* tags */}
				<div className="flex my-2">
					{post.tags.map((tag, i) => (
						<div className="text-primary mx-3" key={tag + i}>
							#{tag}
						</div>
					))}
				</div>
				{/* likes and comments */}
				<div className="flex items-center font-light">
					<div className="flex items-center mx-3">
						<div>{formatNumber(parseInt(post.likes_counter))}</div>
						<img
							className="w-6 mx-1 pb-2"
							src={`/icons/like-${liked ? "dark" : "light"}.svg`}
						/>
					</div>
					<label
						className="flex items-center mx-3 cursor-pointer"
						htmlFor="comment"
					>
						<div>{formatNumber(parseInt(post.comments_counter))}</div>
						<img className="w-6 mx-1" src={`/icons/comment.svg`} />
					</label>
				</div>

				{/* markdown */}
				<ReactMarkdown className="mt-6" children={post.markdown} />
			</article>
			{/* comments */}
			<Comments comments={comments} />
		</section>
	);
};

export const getServerSideProps = async (ctx) => {
	ctx.req.params = ctx.params;
	await withMiddleware(ctx.req, ctx.res, [
		withPassport,
		withValidation("get-post"),
	]);
	const data = await getPost(ctx.params.id, ctx.req.user);
	if (!data) ctx.res.redirect("/");
	return {
		props: JSON.parse(JSON.stringify(data)),
	};
};

export default Post;
