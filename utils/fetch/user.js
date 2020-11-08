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
	data.photo = "";

	let result = validateUserUpdate(data);
	console.log(result);
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
	console.log("data".repeat(10));
	console.log(res);
	if (res.error) {
		res.errors = formatErrors(res.errors);
		return res;
	}
	return res;
};
