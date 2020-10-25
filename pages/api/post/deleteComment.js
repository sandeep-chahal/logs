import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Comment from "../../../models/comment";

export default withMiddlewares(
	[withPassport, authorized, withValidation("post-id")],
	async (req, res) => {
		await dbConnect();

		// check if comment exist
		const comment = await Comment.findById(req.body._id);
		if (!comment) {
			return res.json({
				error: true,
				code: 4, //404
				msg: "This comment doesn't exist anymore.",
			});
		}
		await Comment.findByIdAndDelete(req.body._id);
		await Post.findByIdAndUpdate(comment.on_post, {
			$inc: {
				comments_counter: -1,
			},
		});
		return res.json({
			error: false,
		});
	}
);
