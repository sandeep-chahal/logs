import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import Post from "../../../models/post";

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, "3", "valid-id");
		if (result.error) {
			return res.json(result);
		}
		await dbConnect();

		const { _id, skip } = req.body;

		const posts = await Post.find({ author: _id })
			.select("-markdown")
			.skip(skip)
			.limit(5);
		return res.json({
			error: false,
			data: posts,
		});
	} catch (err) {
		console.log(err.message);
		return res.json({
			error: true,
			code: 106,
		});
	}
};
