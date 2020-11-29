import { IPost } from "../components/post";
import redis from "../config/redis";

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
