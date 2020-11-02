import Comment from "../../../models/comment";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";

export default async (req, res) => {
	const success = await withMiddlewares(req, res, [withValidation("post-id")]);
	if (!success) return;
	const id = req.body._id;
	const skip = req.body.skip;

	const comments = await Comment.find({ on_post: id }).skip(skip).limit(10);

	if (Array.isArray(comments))
		res.json({
			error: false,
			data: comments,
		});
	else
		res.json({
			error: true,
			msg: "Something went wrong",
		});
};
