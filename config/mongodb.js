import mongoose from "mongoose";

async function dbConnect() {
	console.log(
		"-------------------------------global.mongo-------------------------------"
	);

	/* check if we have connection to our database*/
	if (mongoose.connection.readyState >= 1) {
		console.log("returning cached db instance");
		await Promise.resolve(global.mongo);
		return;
	}

	console.log("creating new db connection");
	/* connecting to our database */
	global.mongo = await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
}

export default dbConnect;
