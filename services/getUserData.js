import User from "../models/user";
import Follow from "../models/follow";
import Post from "../models/post";

export default async (id, currentUserId) => {
	try {
		const proms = [];

		// get user profile
		proms.push(User.findById(id));

		// get user posts
		proms.push(
			Post.find({ author: id }, {}, { sort: { createdOn: -1 } })
				.select("-markdown")
				.limit(8)
		);

		// check if you are following the user or not
		if (id != currentUserId && currentUserId) {
			proms.push(Follow.exists({ from: currentUserId, to: id }));
		}
		const results = await Promise.all(proms);
		const user = results[0];
		const posts = results[1];
		const isFollowing = results[2] || false;

		if (!user) return { error: true, code: 104 };

		return {
			error: false,
			user,
			posts,
			isFollowing,
		};
	} catch (err) {
		return {
			error: true,
			code: 106,
		};
	}
};
