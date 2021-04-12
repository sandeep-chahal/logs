import redis from "redis";
export default async () => {
	if (mongo.client && mongo.client.connected) return mongo.client;
	mongo.client = redis.createClient({
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
	});
	await new Promise((resolve) => {
		mongo.client.once("connect", () => {
			console.log("redis connected");
			resolve();
		});
	});
	return mongo.client;
};
