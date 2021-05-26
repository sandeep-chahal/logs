import dbConnect from "../config/mongodb";
import User from "../models/user";
import Post from "../models/post";
import Like from "../models/like";
import Comment from "../models/comment";
import Follow from "../models/follow";
import Fund from "../models/fund";

export default async (postId, user) => {
	try {
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
		let fund;
		const prom2 = [];

		prom2.push(Fund.find({ user: post.author._id }).limit(1));
		if (user)
			prom2.push(
				Follow.exists({
					to: post.author._id,
					from: user._id,
				})
			);
		const res = await Promise.all(prom2);
		following = res[1];
		fund = Array.isArray(res[0]) && res[0].length ? res[0][0] : null;
		console.log(res);

		return {
			post,
			liked: liked || false,
			comments: Array.isArray(comments) ? comments : [],
			following: !!following || false,
			limit: false,
			fund,
		};
	} catch (err) {
		return {
			error: true,
			code: 104,
		};
	}
};
