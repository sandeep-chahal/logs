import redis from "redis";
export default async () => {
	if (global.client && global.client.connected) {
		return global.client;
	}
	global.client = redis.createClient({
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
	});
	await new Promise((resolve) => {
		global.client.once("connect", () => {
			console.log("redis connected");
			resolve();
		});
	});
	return global.client;
};
