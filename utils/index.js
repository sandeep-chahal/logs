import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const getUser = () => {
	try {
		const user = JSON.parse(localStorage.getItem("user"));
		if (!user) return null;
		// check if it's expired
		if (user.expiresOn - Date.now() < 0) {
			setUser(null);
			return null;
		} else return user;
	} catch (err) {
		console.log(err);
		return null;
	}
};
export const setUser = (user) => {
	localStorage.setItem("user", JSON.stringify(user));
};
export const formatNumber = (num) =>
	num < 1000
		? num < 0
			? 0
			: num
		: num < 1000000
		? num / 1000 + "K"
		: num / 1000000 + "M";

export const formatErrors = (errors) => {
	const temp = {};
	errors.forEach((err) => {
		if (err.field) temp[err.field.toLowerCase()] = err.msg;
		else temp["other"] = err.msg;
	});
	return temp;
};

export const getDaysLeft = (d1, d2) => {
	try {
		const date1 = new Date(d1);
		const date2 = new Date(d2);
		return parseInt((date1 - date2) / (1000 * 60 * 60 * 24));
	} catch (err) {
		console.log(err);
		return 0;
	}
};
export const getDatePercentage = (s, e) => {
	const start = new Date(s);
	const end = new Date(e);
	const today = new Date();
	const percetage = Math.round(((today - start) / (end - start)) * 100);
	return (percetage ? 100 - percetage : percetage) + "%";
};
export const formatDate = (time) => {
	const fromNow = dayjs(time).fromNow();
	if (
		fromNow.includes("Seconds") ||
		fromNow.includes("Minutes") ||
		fromNow.includes("Hours")
	)
		return fromNow;

	return dayjs(time).format("dddd, MMMM D, YYYY");
};
