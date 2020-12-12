import dbConnect from "../config/mongodb";
import Post from "../models/post";

export default async (postId, user) => {
	try {
		await dbConnect();

		const post = await Post.findById(postId);

		if (!post)
			return {
				error: true,
				code: 104, //not found
			};

		if (String(post.author) !== String(user._id)) {
			return {
				error: true,
				code: 103, //permissions error
			};
		}
		return {
			error: false,
			post,
		};
	} catch (err) {
		return {
			error: true,
			coed: 106,
		};
	}
};
