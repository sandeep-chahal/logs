import Post from "../../../models/post";
import { addLatest } from "../../../services/redis";

import withMiddlewares from "../../../middlewares";

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, "1 2 3", "post-add");
		if (result.error) return res.json(result);
		console.log(req.body);
		// creating post
		const post = await Post.create({
			title: req.body.title,
			markdown: req.body.markdown,
			tags: req.body.tags || [],
			author: req.user._id,
			header_img: req.body.header_img || "",
		});
		// add to redis
		await addLatest({
			title: post.title,
			_id: post._id,
			createdOn: post.createdOn,
			tags: post.tags,
			author: {
				name: req.user.name,
				_id: req.user._id,
			},
			header_img: post.header_img,
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
