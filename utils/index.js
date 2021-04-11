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

const weekdays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const convert24to12 = (date) => {
	const hour = date.getHour();
	const min = date.getMinutes();
	if (hour > 12) {
		return `${hour - 12}:${min} p.m`;
	}
	return `${hour}:${min} a.m`;
};

const calculateMin = (date, now) => {
	const diff = now.getMilliseconds() - date.getMilliseconds();
	if (diff < 60000) {
		let sec = diff < 600000;
		if (sec) return `${Math.ceil(diff / 1000)} sec ago`;
		return `${Math.ceil(diff / 60000)} min ago`;
	}
	return `at ${convert24to12(date)}`;
};

export const formatDate = (time) => {
	const date = new Date(time);
	const now = new Date();
	if (
		now.getMonth() === date.getMonth() &&
		now.getDate() <= date.getDate() + 1
	) {
		if (now.getDate() === date.getDate()) {
			return `Today, ${calculateMin(date, now)}`;
		} else {
			return `Yesterday, ${calculateMin(date, now)}`;
		}
	}
	return `${weekdays[date.getDay()]}, ${
		months[date.getMonth()]
	} ${date.getDate()}, ${date.getFullYear()}`;
};
