import redirect from "micro-redirect";
import dbConnect from "../config/mongodb";
import passport from "./passport";
import validation from "./validation";
import authentication from "./authentication";

export const withMiddlewares = async (req, res, middleware = []) => {
	await dbConnect();

	res.redirect = (location) => redirect(res, 302, location);

	for (let i = 0; i < middleware.length; i++) {
		let result = await middleware[i](req, res);
		if (result instanceof Function) result = await middleware(req, res);
		if (result && result.error) return result;
	}
	return {
		error: false,
	};
};

export const withPassport = passport;
export const withValidation = validation;
export const withAuthentication = authentication;
