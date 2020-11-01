import redirect from "micro-redirect";
import dbConnect from "../config/mongodb";

export default async (req, res, middleware = []) => {
	await dbConnect();

	if (!res.redirect) res.redirect = (location) => redirect(res, 302, location);

	for (let i = 0; i < middleware.length; i++) {
		let result = await middleware[i](req, res);
		if (result instanceof Function) result = await middleware(req, res);
		if (!result) return false;
	}
	return true;
};
