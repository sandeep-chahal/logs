import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";
import Comment from "../../../models/comment";
import { addNotf } from "../../../services/redis";

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
	const post = await Post.findOne({ _id: req.body._id }).select("author title");
	if (!post) {
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
	await addNotf(String(post.author), {
		date: Date.now(),
		from: {
			id: post.author,
			name: req.user.name,
		},
		type: "comment",
		post: {
			id: req.body._id,
			title: post.title,
		},
	});
	return res.json({
		error: false,
		data: comment,
	});
};
