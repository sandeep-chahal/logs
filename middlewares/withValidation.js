import validator from "../utils/validation";

export default (type) => (req, res, next) => {
	switch (type) {
		case "post":
			const titleErrors = validator("Title", req.body.title)
				.notEmpty()
				.isString()
				.hasLength({ min: 5, max: 100 }).errors;
			const markdownErrors = validator("Markdown", req.body.markdown)
				.notEmpty()
				.isString()
				.hasLength({ min: 20, max: 1500 }).errors;
			if (titleErrors.hasError || markdownErrors.hasError) {
				res.json({
					error: true,
					code: 1, //validation error
					errors: [...titleErrors.array, ...markdownErrors.array],
				});
			}
		default:
			next();
	}
};
