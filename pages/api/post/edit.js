import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
		withValidation("post-edit"),
	]);
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	// check if the pst belongs to this users
	const author = await Post.findById(req.body._id).select("author");
	if (!author || String(req.user._id) !== String(author.author))
		return res.json({
			error: true,
			code: 2, //permission error
			msg: "You don't have permissions to edit this post.",
		});

	// edit the post
	const editedPostData = {};
	if (req.body.title) editedPostData.title = req.body.title;
	if (req.body.markdown) editedPostData.markdown = req.body.markdown;
	if (req.body.tags) editedPostData.tags = req.body.tags;
	console.log(req.body.tags, typeof req.body.tags);
	const post = await Post.findByIdAndUpdate(
		{ _id: req.body._id },
		{
			...editedPostData,
			updatedOn: Date.now(),
		}
	);

	// return the post title and _id
	return res.json({
		error: false,
		data: { _id: post._id },
	});
};
