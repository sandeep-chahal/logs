// import mongoose from "mongoose";

// async function dbConnect() {
// 	/* check if we have connection to our database*/
// 	if (global.mongo && global.mongo.connection.readyState >= 1) {
// 		await Promise.resolve(global.mongo);
// 		return;
// 	}

// 	console.log("creating new db connection");
// 	/* connecting to our database */
// 	global.mongo = await mongoose.connect(process.env.MONGODB_URI, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useFindAndModify: false,
// 	});
// }

// export default dbConnect;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
			bufferMaxEntries: 0,
			useFindAndModify: false,
			useCreateIndex: true,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
