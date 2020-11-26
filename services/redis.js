import redis from "../config/redis";

const promisify = async (fn, ...args) => {
	return new Promise((resolve, reject) => {
		fn(...args, (err, rep) => {
			if (("ERROR::", err)) {
				console.log(err);
				reject(err);
			} else {
				resolve(rep);
			}
		});
	});
};

export const addLatest = async (data) => {
	const client = await redis();
	const len = await promisify(client.llen.bind(client, "latest"));
	if (len > 30) {
		await promisify(client.rpop.bind(client, "latest"));
	}
	await promisify(client.lpush.bind(client, "latest", JSON.stringify(data)));
};

export const getLatest = async (start = 0, last = 31) => {
	const client = await redis();
	const posts = await promisify(
		client.lrange.bind(client, "latest", start, last)
	);
	return posts
		.filter((post) => post.length > 10)
		.map((post) => JSON.parse(post));
};
