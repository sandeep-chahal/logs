import {
	withMiddlewares,
	withAuthentication,
	withPassport,
	withValidation,
} from "../../../middlewares";
import dbConnect from "../../../config/mongodb";
import User from "../../../models/user";
import Follow from "../../../models/follow";

export default async (req, res) => {
	const result = await withMiddlewares([
		withPassport,
		withAuthentication,
		withValidation("valid-id"),
	]);
	if (result.error) {
		return res.json(result);
	}
	await dbConnect();

	// check if user trying to follow him/herself
	if (String(req.body._id) === String(req.user._id)) {
		return res.json({
			error: true,
			code: 5, //invalid operation
			msg: "You can't follow yourself.",
		});
	}

	// check if user already following
	const alreadyFollowing = await Follow.exists({
		to: req.body._id,
		from: req.user._id,
	});

	// follow if not following already
	if (!alreadyFollowing) {
		const prom1 = Follow.create({
			to: req.body._id,
			from: req.user._id,
		});
		const prom2 = User.findByIdAndUpdate(req.user._id, {
			$inc: {
				following_counter: 1,
			},
		});
		const prom3 = User.findByIdAndUpdate(req.body._id, {
			$inc: {
				follower_counter: 1,
			},
		});

		await Promise.all([prom1, prom2, prom3]);
	}

	return res.json({
		error: false,
	});
};
