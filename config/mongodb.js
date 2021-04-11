import mongoose from "mongoose";

async function dbConnect() {
	console.log(
		"-------------------------------global.mongo-------------------------------"
	);
	console.log(global.mongo);
	/* check if we have connection to our database*/
	if (global.mongo && global.mongo.isConnected) {
		return;
	}
	console.log("creating new connection");
	global.mongo = { isConnected: false };
	/* connecting to our database */
	const db = await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	global.mongo.isConnected = db.connections[0].readyState;
}

export default dbConnect;
