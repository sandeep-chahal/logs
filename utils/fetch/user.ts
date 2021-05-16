import { validateUserUpdate } from "../../middlewares/validation";
import { formatErrors } from "../index";

import { IUser } from "../../models/user";

type IError = {
	[k: string]: string;
};

interface IData {
	error: boolean;
	code?: number;
	errors?: IError;
	data?: IUser;
	msg?: string;
}

export const handleFollow = async (
	action: "follow" | "unfollow",
	userId: string
): Promise<IData> => {
	try {
		let res: IData = await (
			await fetch(`/api/user/${action}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					_id: userId,
				}),
			})
		).json();

		return res;
	} catch (err) {
		return {
			error: true,
			msg: "Something went wrong!",
		};
	}
};

export const updateProfile = async (data: IUser): Promise<IData> => {
	let result = validateUserUpdate(data);
	if (result && result.errors) {
		// @ts-ignore
		result.errors = formatErrors(result.errors) as IError;
		// @ts-ignore
		return result;
	}
	let res: IData = await (
		await fetch("/api/user/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
	).json();
	// @ts-ignore
	if (res.error) res.errors = formatErrors(res.errors);
	return res;
};

export const getNotification = async () => {
	const res = await fetch("/api/user/get-notf");
	const data = await res.json();
	if (data.error) throw data.msg;
	return data.data;
};
