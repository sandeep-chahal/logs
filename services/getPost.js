import dbConnect from "../config/mongodb";
import User from "../models/user";
import Post from "../models/post";
import Like from "../models/like";
import Comment from "../models/comment";
import Follow from "../models/follow";

export default async (postId, user) => {
	try {
		await dbConnect();

		let proms = [];

		proms.push(
			global.mongo.isConnected.models.post.findById(postId).populate({
				path: "author",
				model: User,
			})
		);
		proms.push(
			global.mongo.isConnected.models.comment.find({ on_post: postId }).limit(5)
		);
		if (user)
			proms.push(
				global.mongo.isConnected.models.like.exists({
					on_post: postId,
					by_user: user._id,
				})
			);

		const [post, comments, liked] = await Promise.all(proms);

		if (!post)
			return {
				error: true,
				code: 104,
			};

		let following;
		if (user)
			following = await global.mongo.isConnected.models.follow.exists({
				to: post.author._id,
				from: user._id,
			});

		return {
			post,
			liked: liked || 0,
			comments: Array.isArray(comments) ? comments : [],
			following: !!following || false,
		};
	} catch (err) {
		return {
			error: true,
			code: 104,
		};
	}
};
