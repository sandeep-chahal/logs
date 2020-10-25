import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Comment from "../../../models/comment";

export default withMiddlewares(
	[withPassport, authorized, withValidation("post-comment")],
	async (req, res) => {
		await dbConnect();

		// check if post exist
		const isPostExist = await Post.exists({ _id: req.body._id });
		if (!isPostExist) {
			return res.json({
				error: true,
				code: 4, //404
				msg: "This post doesn't exist anymore.",
			});
		}
		const comment = await Comment.create({
			on_post: req.body._id,
			by_user: req.user._id,
			content: req.body.content,
		});
		await Post.findByIdAndUpdate(req.body._id, {
			$inc: {
				comment_counter: 1,
			},
		});
		return res.json({
			error: false,
			data: comment,
		});
	}
);
