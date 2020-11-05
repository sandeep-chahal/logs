import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Comment from "../../../models/comment";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
		withValidation("post-comment"),
	]);
	if (result.error) {
		return res.json(result);
	}
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
