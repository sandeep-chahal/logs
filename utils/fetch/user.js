import { validateUserUpdate } from "../../middlewares/validation";

const formatErrors = (errors) => {
	const temp = {};
	errors.forEach((err) => {
		if (err.field) temp[err.field.toLowerCase()] = err.msg;
		else temp["other"] = err.msg;
	});
	return temp;
};

export const updateProfile = async (data) => {
	let result = validateUserUpdate(data);
	if (result.error) {
		result.errors = formatErrors(result.errors);
		return result;
	}
	let res = await fetch("/api/user/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	res = await res.json();
	if (res.error) {
		res.errors = formatErrors(res.errors);
		return res;
	}
	return res;
};
