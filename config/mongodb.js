import mongoose from "mongoose";

async function dbConnect() {
	/* check if we have connection to our database*/
	if (global.mongo && global.mongo.connection.readyState >= 1) {
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
