import mongoose from "mongoose";

async function dbConnect() {
	console.log(
		"-------------------------------global.mongo-------------------------------"
	);

	/* check if we have connection to our database*/
	if (global.mongo && global.mongo.isConnected) {
		console.log("returning cached db instance");
		return;
	}
	console.log("creating new db connection");
	global.mongo = { isConnected: false };
	/* connecting to our database */
	const db = await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	global.mongo = db;
}

export default dbConnect;
