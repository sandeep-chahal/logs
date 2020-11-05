import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Like from "../../../models/like";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
		withValidation("valid-id"),
	]);
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	// check if the user has liked the post
	const hasLiked = await Like.exists({
		on_post: req.body._id,
		by_user: req.user._id,
	});
	if (hasLiked) {
		await Like.findOneAndDelete({
			on_post: req.body._id,
			by_user: req.user._id,
		});
		await Post.findByIdAndUpdate(req.body._id, {
			$inc: {
				likes_counter: -1,
			},
		});
	}

	return res.json({
		error: false,
	});
};
