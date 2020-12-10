import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import getPost from "../../services/getPost";
import {
	withMiddlewares,
	withPassport,
	withValidation,
} from "../../middlewares";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { formatNumber } from "../../utils";
import { handleLikeClick } from "../../utils/fetch/post";
import Comments from "../../components/comments";
import { useState } from "react";

import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { IUser } from "../../models/user";
import { IPost } from "../../models/post";
import { IComment } from "../../models/comment";

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
}

const Post: React.FC<IProps> = (props) => {
	const [liked, setLiked] = useState(props.liked || 0);
	const [comments, setComments] = useState(props.comments);
	const [post, setPost] = useState(props.post);

	return (
		<section className="p-6 px-20 min-h-screen">
			{/* post */}
			<article className="p-4 text-darkBlue">
				{/* title */}
				<h2 className="text-3xl font-extrabold text-gradient-1">
					{post.title}
				</h2>
				{/* author name , date published */}
				<div className="flex items-center text-base font-medium">
					<span className="w-1 h-1 bg-darkBlue rounded block mx-3" />
					<span>{post.author.name}</span>
					<span className="w-1 h-1 bg-darkBlue rounded block mx-3" />
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
					<div
						className="flex items-center mx-3 cursor-pointer"
						onClick={() =>
							handleLikeClick(
								liked ? "unlike" : "like",
								post._id,
								setLiked,
								setPost
							)
						}
					>
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

				{/* header image */}
				{post.header_img ? (
					<img
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
			</article>
			{/* comments */}
			<Comments
				id={post._id}
				post={post}
				setPost={setPost}
				comments={comments}
				setComments={setComments}
			/>
		</section>
	);
};

interface CREQ extends NextApiRequest {
	user: IUser;
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
}: CGSSP): Promise<{ props: IProps } | null> => {
	req.body = params;
	const result = await withMiddlewares(req, res, [
		withPassport,
		withValidation("valid-id"),
	]);
	if (result.error) {
		res.redirect("/error?error_code=105");
	} else {
		const data = await getPost(params.id, req.user);
		if (data.error) res.redirect("/error?error_code=" + data.code);
		else
			return {
				props: JSON.parse(JSON.stringify(data)),
			};
	}
	return null;
};

export default Post;
