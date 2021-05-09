import { NextApiRequest, NextApiResponse } from "next";
import getPost from "../../services/getPost";
import withMiddlewares from "../../middlewares";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { formatNumber } from "../../utils";
import { handleLikeUnlike } from "../../utils/fetch/post";
import Comments from "../../components/comments";
import { useState } from "react";
import { motion } from "framer-motion";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IUser } from "../../models/user";
import { IPost } from "../../models/post";
import { IComment } from "../../models/comment";
import Head from "next/head";
import { useStore } from "../../store";
import { showModal } from "../../store/actions";

const renderers = {
	code: ({ language = "js", value = "" }) => {
		return <SyntaxHighlighter language={language} children={value} />;
	},
	link: ({ href, children }: { href: string; children: React.ReactNode }) => {
		return (
			<a className="text-blue-600" href={href} target="_blank">
				{children}
			</a>
		);
	},
};

interface IProps {
	post: IPost;
	comments: IComment[];
	liked: boolean;
	limit: boolean;
}

const Post: React.FC<IProps> = (props) => {
	const [liked, setLiked] = useState(props.liked);
	const [comments, setComments] = useState(props.comments);
	const [post, setPost] = useState(props.post);
	const [wait, setWait] = useState(false);
	const [_, dispatch] = useStore();

	const handleLikeClick = () => {
		if (wait) return;
		setPost((prev) => ({
			...prev,
			likes_counter: prev.likes_counter + (liked ? -1 : 1),
		}));
		setLiked(!liked);
		setWait(true);
		handleLikeUnlike(liked, post._id)
			.then((data) => {
				if (data.error) {
					// undo if error
					setPost((prev) => ({
						...prev,
						likes_counter: prev.likes_counter + (!liked ? -1 : 1),
					}));
					setLiked(liked);

					dispatch(
						showModal(true, {
							type: "ERROR",
							msg: data.msg,
						})
					);
				} else {
					// setPost((prev) => ({
					// 	...prev,
					// 	likes_counter: prev.likes_counter + (liked ? -1 : 1),
					// }));
					// setLiked(!liked);
				}
			})
			.finally(() => {
				setWait(false);
			});
	};

	return (
		<section className="p-2 md:px-10 lg:px-20 min-h-screen">
			<Head>
				<title>{post.title}</title>
				<meta
					name="description"
					content={post.markdown.substr(0, 200) + "..."}
				/>
				<meta
					name="tags"
					content={post.tags.join(", ") + ` ${post.author.name}`}
				/>
				<meta property="og:title" content={post.title} />
				<meta
					property="og:description"
					content={post.markdown.substr(0, 200) + "..."}
				/>
				{post.header_img ? (
					<meta property="og:image" content={post.header_img} />
				) : null}
			</Head>
			{/* post */}
			<article className="p-4 text-darkBlue">
				{/* title */}
				<h2 className="text-2xl md:text-3xl font-extrabold text-gradient-3">
					{post.title}
				</h2>
				{/* author name , date published */}
				<div className="flex flex-col md:flex-row lg:items-center text-base font-medium">
					<div className="flex items-center">
						<span className="w-1 h-1 bg-darkBlue rounded block mr-3" />
						<span>{post.author.name}</span>
					</div>
					<div className="flex items-center md:ml-3">
						<span className="w-1 h-1 bg-darkBlue rounded block mr-3" />
						<span>{dayjs(post.createdOn).format("dddd, MMMM D YYYY")}</span>
					</div>
				</div>
				{/* tags */}
				<div className="flex my-2">
					{post.tags.map((tag, i) => (
						<div className="text-primary mx-3" key={tag + i}>
							#{tag}
						</div>
					))}
				</div>
				{!props.limit ? (
					<>
						{/* likes and comments */}
						<div className="flex items-center font-light">
							<motion.div
								whileHover={{
									scale: 1.2,
									transition: { duration: 0.1 },
								}}
								whileTap={{ scale: 0.8 }}
								className="flex items-center mx-3 cursor-pointer"
								onClick={handleLikeClick}
							>
								<div>{formatNumber(parseInt(post.likes_counter))}</div>

								<img
									className="w-6 mx-1 pb-2"
									src={`/icons/like-${liked ? "dark" : "light"}.svg`}
								/>
							</motion.div>
							<label
								className="flex items-center mx-3 cursor-pointer"
								htmlFor="comment"
							>
								<div>{formatNumber(parseInt(post.comments_counter))}</div>
								<img className="w-6 mx-1" src={`/icons/comment.svg`} />
							</label>
						</div>

						{/* header image */}
						{post.header_img ? (
							<motion.img
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								alt="post header image"
								src={post.header_img}
								className="block m-auto my-4"
							/>
						) : null}

						{/* markdown */}
						<ReactMarkdown
							renderers={renderers}
							plugins={[gfm]}
							className="mt-6 markdown font-medium"
							children={post.markdown}
						/>
					</>
				) : (
					<div className="text-red-700 text-xl">
						You have exhausted your daily limit. Please buy a subscription to
						continue reading...
					</div>
				)}
			</article>
			{/* comments */}
			{!props.limit && (
				<Comments
					id={post._id}
					post={post}
					setPost={setPost}
					comments={comments}
					setComments={setComments}
				/>
			)}
		</section>
	);
};

interface CREQ extends NextApiRequest {
	user: IUser;
	session: {
		views: undefined | number;
	};
}
interface CGSSP {
	req: CREQ;
	res: NextApiResponse;
	params: { id: string };
}

export const getServerSideProps = async ({
	params,
	req,
	res,
}: CGSSP): Promise<{ props?: IProps; redirect?: any } | null> => {
	req.body = params;
	const result = await withMiddlewares(req, res, "1 3", "valid-id");
	if (result.error) {
		return {
			redirect: {
				permanent: false,
				destination: `/error?error_code=105`,
			},
		};
	} else {
		const data = await getPost(params.id, req.user);
		if (data.error)
			return {
				redirect: {
					permanent: false,
					destination: `/error?error_code=${data.code}`,
				},
			};
		else {
			let views = req.session.views || 1;
			req.session.views = views + 1;

			console.log(req.user.email, views);

			if (
				views > 3 &&
				(!req.user ||
					!req.user.subscription ||
					new Date(req.user.subscription.expiresOn || 0) < new Date())
			) {
				data.post.markdown = "";
				data.limit = true;
			}
			return {
				props: JSON.parse(JSON.stringify(data)),
			};
		}
	}
	return null;
};

export default Post;
