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
	if (user) proms.push(Like.exists({ on_post: postId, by_user: user._id }));
	if (user) proms.push(Comment.find({ on_post: postId }).limit(5));

	const [post, liked, comments] = await Promise.all(proms);

	let following;
	if (user)
		following = await Follow.exists({
			to: post.author._id,
			from: user._id,
		});

	if (post)
		return {
			post,
			liked: liked || null,
			comments: comments || null,
			following: following || null,
		};
	else null;
};
