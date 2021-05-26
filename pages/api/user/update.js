import withMiddlewares from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, "1 2 3", "user-update");
		if (result.error) return res.json(result);
		await dbConnect();
		// extract data
		const data = {};
		if (req.body.photo) data.photo = req.body.photo;
		data.name = req.body.name;
		data.title = req.body.title;
		data.summary = req.body.summary;
		data.location = req.body.location;
		data.web = req.body.web;
		data.linkedin = req.body.linkedin;
		data.github = req.body.github;
		data.twitter = req.body.twitter;

		await User.findByIdAndUpdate(req.user._id, data);
		const user = await User.findById(req.user._id).select(
			"_id email photo name subscription"
		);
		console.log(user);
		req.login(user, (err) => {});
		res.json({
			error: false,
			data: user,
		});
	} catch (err) {
		console.log(err);
		res.json({
			err: true,
			errors: [{ field: null, msg: "Something Went Wrong" }],
		});
	}
};
