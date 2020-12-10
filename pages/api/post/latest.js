import { getLatest } from "../../../services/redis";

export default async (req, res) => {
	try {
		const posts = await getLatest();
		if (posts) res.json({ error: false, data: posts });
		else
			res.json({
				error: true,
				errors: [{ msg: "Posts not found!" }],
			});
	} catch (err) {
		res.json({
			error: true,
			errors: [{ msg: "Something went wrong!" }],
		});
	}
};
