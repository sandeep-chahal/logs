export const getFund = async (id) => {
	try {
		const res = await fetch(`/api/fund/get`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				_id: id,
			}),
		});
		const result = await res.json();
		return result;
	} catch (err) {
		console.log(err);
		return {
			error: true,
			msg: "Something went wrong!",
		};
	}
};

export const modifyFund = async ({
	_id,
	total,
	deadline,
	img,
	title,
	summary,
}) => {
	try {
		const data = {};
		if (_id) data._id = _id;
		if (img) data.img = img;
		if (title) data.title = title;
		if (total) data.total = total;
		if (deadline) data.deadline = deadline;
		if (summary) data.summary = summary;
		let result = await fetch(_id ? `/api/fund/update` : "/api/fund/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		result = result.json();
		console.log(result);
		return result;
	} catch (err) {
		console.log(err);
		return {
			error: true,
			msg: err.message,
		};
	}
};
