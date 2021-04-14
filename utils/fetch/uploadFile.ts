import axios from "axios";

interface IData {
	error: boolean;
	code?: number;
	errors?: {
		[k: string]: string;
	};
	data?: string;
}

export default async (file: File): Promise<IData> => {
	try {
		const url = `https://api.cloudinary.com/v1_1/${"spidy"}/upload`;

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "d2wpin3w");
		// @ts-ignore
		const boundary = data._boundary as string;
		const headers = new Headers({
			"Content-Type": `multipart/form-data; boundary=${boundary}`,
		});
		const results = await axios.post(url, data, {
			headers,
		});

		return {
			error: false,
			data: results.data.url,
		};
	} catch (err) {
		console.log(err);
		return {
			error: true,
			code: 106,
			errors: { other: "Something went wrong" },
		};
	}
};
