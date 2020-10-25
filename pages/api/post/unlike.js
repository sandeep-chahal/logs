import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Like from "../../../models/like";

export default withMiddlewares(
	[withPassport, authorized, withValidation("post-id")],
	async (req, res) => {
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
	}
);
