import validator from "../utils/validation";

export default (type) => (req, res) => {
	switch (type) {
		case "post-id":
			return checkPostId(req, res);
		case "post-add":
			return addPostValidation(req, res);
		case "post-edit":
			return editPostValidation(req, res);
		case "post-comment":
			return commentPostValidation(req, res);
		case "get-post":
			return getPostValidation(req, res);
		default:
			return true;
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
		res.json({
			error: true,
			code: 1,
			errors: [...titleErrors.array, ...markdownErrors.array],
		});
		return false;
	}
	return true;
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
		res.json({
			error: true,
			code: 1,
			errors: [...idError.array, ...titleErrors.array, ...markdownErrors.array],
		});
		return false;
	}
	return true;
}

function checkPostId(req, res) {
	const idError = validator("Id", req.body._id).isMongoDbId().errors;
	if (idError.hasError) {
		res.json({
			error: true,
			code: 1,
			errors: idError.array,
		});
		return false;
	}
	return true;
}

function commentPostValidation(req, res) {
	const idError = validator("Comment Id", req.body._id).isMongoDbId().errors;
	const contentErrors = validator("Comment", req.body.content)
		.notEmpty()
		.isString()
		.hasLength({ min: 3, max: 400 }).errors;
	if (idError.hasError || contentErrors.hasError) {
		res.json({
			error: true,
			code: 1,
			errors: [...idError.array, ...contentErrors.array],
		});
		return false;
	}
	return true;
}

function getPostValidation(req, res) {
	const idError = validator("id", req.params.id).isMongoDbId().errors;
	if (idError.hasError) {
		res.redirect("/");
		return false;
	}
	return true;
}
