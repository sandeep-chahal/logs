import { NextApiRequest, NextApiResponse } from "next";
import Post from "../../../models/post";
import User from "../../../models/user";
import dbConnect from "../../../config/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const q = req.query.q;
	const skip = Number(req.query.skip) || 0;
	if (typeof q !== "string")
		return res.json({
			error: true,
			errors: [{ msg: "Invalid search query" }],
		});
	if (q.length < 3)
		return res.json({
			error: true,
			errors: [{ msg: "Search query must be greater then 3" }],
		});

	const posts = await Post.find({ $text: { $search: q } })
		.skip(skip)
		.limit(15)
		.select("-markdown")
		.populate({
			path: "author",
			model: User,
			select: "name photo",
		});
	console.log(posts);

	res.json({ error: false, data: posts });
};
