import Comment from "../../../models/comment";
import { withMiddlewares, withValidation } from "../../../middlewares";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, [withValidation("valid-id")]);
	if (result.error) {
		return res.json(result);
	}
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
