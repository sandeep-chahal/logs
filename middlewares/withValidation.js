import validator from "../utils/validation";

export default (type) => (req, res, next) => {
	switch (type) {
		case "post-add":
			addPostValidation(req, res);
		case "post-edit":
			editPostValidation(req, res);
		case "post-id":
			checkPostId(req, res);
		default:
			next();
	}
};

function addPostValidation(req, res) {
	const titleErrors = validator("Title", req.body.title)
		.notEmpty()
		.isString()
		.hasLength({ min: 5, max: 100 }).errors;

	const markdownErrors = validator("Markdown", req.body.markdown)
		.notEmpty()
		.isString()
		.hasLength({ min: 20, max: 1500 }).errors;

	if (titleErrors.hasError || markdownErrors.hasError) {
		return res.json({
			error: true,
			code: 1,
			errors: [...titleErrors.array, ...markdownErrors.array],
		});
	}
}

function editPostValidation(req, res) {
	const idError = validator("Id", req.body._id).isMongoDbId().errors;

	const titleErrors = validator("Title", req.body.title)
		.notEmpty()
		.isString()
		.hasLength({ min: 5, max: 100 }).errors;

	const markdownErrors = validator("Markdown", req.body.markdown)
		.notEmpty()
		.isString()
		.hasLength({ min: 20, max: 1500 }).errors;

	if (idError.hasError || titleErrors.hasError || markdownErrors.hasError) {
		return res.json({
			error: true,
			code: 1,
			errors: [...idError.array, ...titleErrors.array, ...markdownErrors.array],
		});
	}
}

function checkPostId(req, res) {
	const idError = validator("Id", req.body._id).isMongoDbId().errors;
	if (idError.hasError)
		return res.json({
			error: true,
			code: 1,
			errors: idError.array,
		});
}
