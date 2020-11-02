import withPassport from "../../../middlewares/withPassport";
import withMiddlewares from "../../../middlewares/withMiddlewares";
import withValidation from "../../../middlewares/withValidation";
import authorized from "../../../middlewares/authorized";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";

export default async (req, res) => {
	await withMiddlewares(req, res, [
		withPassport,
		authorized,
		withValidation("post-id"),
	]);
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
