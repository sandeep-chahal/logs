import redirect from "micro-redirect";

export default (middlewares = [], cb = () => {}) => (req, res) => {
	if (!res.redirect) {
		res.redirect = (location) => redirect(res, 302, location);
	}

	const callMiddleware = (middlewares, counter) => {
		if (counter >= middlewares.length) {
			return cb(req, res);
		} else {
			middlewares[counter](req, res, (error) => {
				if (error) return;
				return callMiddleware(middlewares, ++counter);
			});
		}
	};
	callMiddleware(middlewares, 0);
};
