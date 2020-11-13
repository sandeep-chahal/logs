import User from "../models/user";

export default async (id) => {
	try {
		const user = await User.findById(id);

		return {
			error: false,
			user,
		};
	} catch (err) {
		return {
			error: true,
			code: 106,
		};
	}
};
