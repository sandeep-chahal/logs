import User from "../models/user";
import Post from "../models/post";

export default async (id) => {
	try {
		const user = await User.findById(id);
		if (!user) return { error: true, code: 104 };

		const posts = await Post.find(
			{ author: id },
			{},
			{ sort: { createdOn: -1 } }
		)
			.select("-markdown")
			.limit(8);

		return {
			error: false,
			user,
			posts,
		};
	} catch (err) {
		return {
			error: true,
			code: 106,
		};
	}
};
