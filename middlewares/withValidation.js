import validator from "../utils/validation";

export default (type) => (req, res, next) => {
	switch (type) {
		case "post-id":
			checkPostId(req, res);
			next();
			break;
		case "post-add":
			addPostValidation(req, res);
			next();
			break;
		case "post-edit":
			editPostValidation(req, res);
			next();
			break;
		case "post-comment":
			commentPostValidation(req, res);
			next();
			break;
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

function commentPostValidation(req, res) {
	const idError = validator("Comment Id", req.body._id).isMongoDbId().errors;
	const contentErrors = validator("Comment", req.body.content)
		.notEmpty()
		.isString()
		.hasLength({ min: 3, max: 400 }).errors;
	if (idError.hasError || contentErrors.hasError)
		return res.json({
			error: true,
			code: 1,
			errors: [...idError.array, ...contentErrors.array],
		});
}
