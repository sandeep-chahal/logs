import validator from "../utils/validation";

export default (type) => (req, res) => {
	switch (type) {
		case "valid-id":
			return checkValidId(req, res);
		case "post-add":
			return addPostValidation(req, res);
		case "post-edit":
			return editPostValidation(req, res);
		case "post-comment":
			return commentPostValidation(req, res);
		case "get-post":
			return getPostValidation(req, res);
		case "user-update":
			return validateUserUpdate(req.body);
		default:
			return false;
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
		return {
			error: true,
			code: 102,
			errors: [...titleErrors.array, ...markdownErrors.array],
		};
	}
	return false;
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
		return {
			error: true,
			code: 102,
			errors: [...idError.array, ...titleErrors.array, ...markdownErrors.array],
		};
	}
	return false;
}

function commentPostValidation(req, res) {
	const idError = validator("Comment Id", req.body._id).isMongoDbId().errors;
	const contentErrors = validator("Comment", req.body.content)
		.notEmpty()
		.isString()
		.hasLength({ min: 3, max: 400 }).errors;
	if (idError.hasError || contentErrors.hasError) {
		return {
			error: true,
			code: 102,
			errors: [...idError.array, ...contentErrors.array],
		};
	}
	return false;
}

function checkValidId(req, res) {
	const idError = validator("Id", req.body._id).isMongoDbId().errors;
	if (idError.hasError)
		return {
			error: true,
			code: 102,
			errors: idError.array,
		};
	return false;
}

export function validateUserUpdate(data = {}) {
	let titleError, summaryError, locationError;
	let regexError = [];
	if (data.title)
		titleError = validator("Title", data.title)
			.isString()
			.notEmpty()
			.hasLength({ min: 3, max: 50 });
	if (data.summary)
		summaryError = validator("Summary", data.summary)
			.isString()
			.notEmpty()
			.hasLength({ min: 3, max: 150 });

	if (data.location)
		locationError = validator("Location", data.summary)
			.isString()
			.notEmpty()
			.hasLength({ min: 3, max: 50 });

	const githubRegex = new RegExp("https://github.com/");
	if (data.github && !githubRegex.test(data.github)) {
		regexError.push({
			field: "github",
			msg: "Invalid Github Link",
		});
	}
	const linkedinRegex = new RegExp("https://linkedin.com/");
	if (data.linkedin && !linkedinRegex.test(data.linkedin)) {
		regexError.push({
			field: "linkedin",
			msg: "Invalid Linkedin Link",
		});
	}
	const twitterRegex = new RegExp("https://twitter.com/");
	if (data.twitter && !twitterRegex.test(data.twitter)) {
		regexError.push({
			field: "twitter",
			msg: "Invalid Twitter Link",
		});
	}
	const webRegex = new RegExp("http");
	if (data.web && !webRegex.test(data.web)) {
		regexError.push({
			field: "web",
			msg: "Invalid Web Link",
		});
	}
	const photoRegex = new RegExp("http");
	if (data.photo && !photoRegex.test(data.photo)) {
		regexError.push({
			field: "photo",
			msg: "Upload photo again",
		});
	}
	const errors = [
		...regexError,
		...(titleError || []),
		...(summaryError || []),
		...(locationError || []),
	];
	if (errors.length > 0)
		return {
			error: true,
			code: 102,
			errors,
		};
	return false;
}
