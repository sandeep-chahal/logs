import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";

export default async (req, res) => {
	try {
		const result = await withMiddlewares(req, res, [
			withPassport,
			withAuthentication,
			withValidation("user-update"),
		]);
		if (result.error) return res.json(result);
		await dbConnect();
		// extract data
		const data = {};
		if (req.body.photo) data.photo = req.body.photo;
		data.title = req.body.title;
		data.summary = req.body.summary;
		data.location = req.body.location;
		data.web = req.body.web;
		data.linkedin = req.body.linkedin;
		data.github = req.body.github;
		data.twitter = req.body.twitter;

		console.log(req.body);

		await User.findByIdAndUpdate(req.user._id, data);
		const user = await User.findById(req.user._id);
		console.log(user);

		res.json({
			error: false,
			data: user,
		});
	} catch (err) {
		res.json({
			err: true,
			errors: [{ field: null, msg: "Something Went Wrong" }],
		});
	}
};
