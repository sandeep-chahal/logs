import redirect from "micro-redirect";
import dbConnect from "../config/mongodb";
import passport from "./passport"; //code: 1
import authentication from "./authentication"; //code: 2
import validation from "./validation"; //code: 3

const middlewareFromCode = (middlewareCode, validationCode) => {
	return middlewareCode
		.split(" ")
		.map((code) => {
			if (code === "1") return passport;
			if (code === "2") return authentication;
			if (code === "3") return validation(validationCode);
			return null;
		})
		.filter((m) => m);
};

// middlewareCode = "1 2 3"
const withMiddlewares = async (req, res, middlewareCode, validationCode) => {
	await dbConnect();

	const middleware = middlewareFromCode(middlewareCode, validationCode);

	res.redirect = (location) => redirect(res, 302, location);

	for (let i = 0; i < middleware.length; i++) {
		if (!middleware[i]) continue;
		let result = await middleware[i](req, res);
		if (result && result.error) return result;
	}
	return {
		error: false,
	};
};

export default withMiddlewares;
