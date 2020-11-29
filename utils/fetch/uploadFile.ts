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
		const data = new FormData();
		data.append("img", file);
		// @ts-ignore
		const boundary = data._boundary as string;
		const headers = new Headers({
			"Content-Type": `multipart/form-data; boundary=${boundary}`,
		});
		const results = await axios.post(
			process.env.NEXT_PUBLIC_STORAGE_ENGINE_URL as string,
			data,
			{
				headers,
			}
		);
		if (results.data.error) {
			return {
				error: true,
				code: 102,
				errors: {
					photo: results.data.msg,
				},
			};
		} else {
			return {
				error: false,
				data: results.data.url2,
			};
		}
	} catch (err) {
		console.log(err);
		return {
			error: true,
			code: 106,
			errors: { other: "Something went wrong" },
		};
	}
};
