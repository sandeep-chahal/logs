import dbConnect from "../config/mongodb";
import User from "../models/user";
import Post from "../models/post";
import Like from "../models/like";
import Comment from "../models/comment";
import Follow from "../models/follow";

export default async (postId, user) => {
	await dbConnect();

	let proms = [];

	proms.push(
		Post.findById(postId).populate({
			path: "author",
			model: User,
		})
	);
	proms.push(Comment.find({ on_post: postId }).limit(5));
	if (user) proms.push(Like.exists({ on_post: postId, by_user: user._id }));

	const [post, comments, liked] = await Promise.all(proms);

	if (!post)
		return {
			error: true,
			code: 104,
		};

	let following;
	if (user)
		following = await Follow.exists({
			to: post.author._id,
			from: user._id,
		});

	return {
		post,
		liked: liked || 0,
		comments: Array.isArray(comments) ? comments : [],
		following: !!following || false,
	};
};
