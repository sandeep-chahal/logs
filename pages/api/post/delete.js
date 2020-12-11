import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";

export default async (req, res) => {
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
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

	// delete the post
	await Post.findByIdAndDelete(req.body._id);

	return res.json({
		error: false,
	});
};
