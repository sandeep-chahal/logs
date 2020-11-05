import Post from "../../../models/post";

import {
	withAuthentication,
	withPassport,
	withMiddlewares,
	withValidation,
} from "../../../middlewares";
// const {
// 	withAuthentication,
// 	withPassport,
// 	withMiddlewares,
// 	withValidation,
// } = middlewares;

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, [
			withPassport,
			withAuthentication,
			withValidation("post-add"),
		]);
		if (result.error) return res.json(result);

		// creating post
		const post = await Post.create({
			title: req.body.title,
			markdown: req.body.markdown,
			tags: req.body.tags || [],
			author: req.user._id,
		});

		// return the post title and _id
		return res.json({
			error: false,
			data: { title: post.title, _id: post._id },
		});
	} catch (err) {
		console.log("SWEET SWEET ERROR".repeat(10));
		console.log(err);
	}
};
