import axios from "axios";

export default async (file) => {
	try {
		const data = new FormData();
		data.append("img", file);
		const headers = new Headers({
			"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
		});
		const results = await axios.post(
			process.env.NEXT_PUBLIC_STORAGE_ENGINE_URL,
			data,
			{
				headers,
			}
		);
		if (results.data.error) {
			return {
				error: true,
				code: 102,
				errors: [{ filed: "photo", msg: results.data.msg }],
			};
		} else {
			return {
				error: false,
				data: results.data.url1,
			};
		}
	} catch (err) {
		console.log(err);
		return {
			error: true,
			code: 106,
			errors: [{ filed: "other", msg: "Something went wrong" }],
		};
	}
};
