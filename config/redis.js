import redis from "redis";
const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});

export default async () => {
	if (client.connected) return client;
	await new Promise((resolve) => {
		client.once("connect", () => {
			console.log("redis connected");
			resolve();
		});
	});
	return client;
};
