import redirect from "micro-redirect";

export default (middlewares = [], cb = () => {}) => (req, res) => {
	if (!res.redirect) {
		res.redirect = (location) => redirect(res, 302, location);
	}

	console.log("calling middlewares");

	const callMiddleware = (middlewares, counter) => {
		console.log(`number ${counter + 1} middlewares called`);
		console.log(middlewares[counter]);
		if (counter >= middlewares.length) return cb(req, res);
		middlewares[counter](req, res, (error) => {
			if (error) return;
			console.log("calling callback");
			return callMiddleware(middlewares, ++counter);
		});
	};
	console.log(middlewares);
	callMiddleware(middlewares, 0);
};
