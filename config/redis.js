import redis from "redis";
let client = null;
export default async () => {
	if (client && client.connected) return client;
	client = redis.createClient({
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
	});
	await new Promise((resolve) => {
		client.once("connect", () => {
			console.log("redis connected");
			resolve();
		});
	});
	return client;
};
