import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import Post from "../../../models/post";

export default async (req, res) => {
	const success = await withMiddlewares(req, res, [
		withPassport,
		authorized,
		withValidation("post-add"),
	]);
	if (!success) return;

	// creating post
	const post = await Post.create({
		title: req.body.title,
		markdown: req.body.markdown,
		author: req.user._id,
	});

	// return the post title and _id
	return res.json({
		error: false,
		data: { title: post.title, _id: post._id },
	});
};
