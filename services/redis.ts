import { IPost } from "../models/post";
import redis from "../config/redis";
import { INotf } from "../types";
import { stringify } from "querystring";
const promisify = async <T>(fn: any, ...args: string[]): Promise<T | null> => {
	return new Promise<T | null>((resolve, reject) => {
		fn(...args, (err: Error, rep: T | null) => {
			if (err) {
				console.log(err);
				reject(null);
			} else {
				resolve(rep);
			}
		});
	});
};

export const addLatest = async (data: IPost) => {
	const client = await redis();
	const len = await promisify<number>(client.llen.bind(client, "latest"));
	if (len && len > 30) {
		await promisify(client.rpop.bind(client, "latest"));
	}
	await promisify(client.lpush.bind(client, "latest", JSON.stringify(data)));
};

export const getLatest = async (
	start = 0,
	last = 31
): Promise<IPost[] | null> => {
	const client = await redis();
	const posts = await promisify<string[] | null>(
		client.lrange.bind(client, "latest", start, last)
	);
	if (posts)
		return posts
			.filter((post) => post.length > 10)
			.map((post) => JSON.parse(post));
	else return null;
};

export const addNotf = async (id: string, data: INotf) => {
	const client = await redis();
	await promisify(client.set.bind(client, "notf-" + id, "true"));
	const len = await promisify<number>(client.llen.bind(client, id));
	if (len && len > 10) {
		await promisify(client.rpop.bind(client, id));
		const len = await promisify<number>(client.llen.bind(client, id));
		if (len && len > 30) {
			await promisify(client.rpop.bind(client, id));
		}
	}
	await promisify(client.lpush.bind(client, id, JSON.stringify(data)));
};
export const getNotf = async (id: string): Promise<INotf[] | null> => {
	const client = await redis();
	await promisify(client.set.bind(client, "notf-" + String(id), "false"));
	const notifications = await promisify<string[] | null>(
		client.lrange.bind(client, String(id), 0, 15)
	);
	if (notifications)
		return notifications.map((notification) => JSON.parse(notification));
	else return null;
};
export const hasNotf = async (id: string) => {
	const client = await redis();
	const has = await promisify<string>(client.get.bind(client, "notf-" + id));
	return has === "true" ? true : false;
};
