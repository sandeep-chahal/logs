import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Like from "../../../models/like";

export default async (req, res) => {
	await dbConnect();
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error) {
		return res.json(result);
	}

	// check if post exist
	const isPostExist = await Post.exists({ _id: req.body._id });
	if (!isPostExist) {
		return res.json({
			error: true,
			code: 4, //404
			msg: "This post doesn't exist anymore.",
		});
	}
	// check if the user already like the post
	const alreadyLiked = await Like.exists({
		on_post: req.body._id,
		by_user: req.user._id,
	});
	if (!alreadyLiked) {
		await Like.create({
			on_post: req.body._id,
			by_user: req.user._id,
		});
		await Post.findByIdAndUpdate(req.body._id, {
			$inc: {
				likes_counter: 1,
			},
		});
	}

	return res.json({
		error: false,
	});
};
