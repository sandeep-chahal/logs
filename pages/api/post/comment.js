import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Comment from "../../../models/comment";

export default async (req, res) => {
	const success = await withMiddlewares(req, res, [
		withPassport,
		authorized,
		withValidation("post-comment"),
	]);
	if (!success) return;
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
		by_user: { _id: req.user._id, name: req.user.name },
		content: req.body.content,
	});
	await Post.findByIdAndUpdate(req.body._id, {
		$inc: {
			comments_counter: 1,
		},
	});
	return res.json({
		error: false,
		data: comment,
	});
};
