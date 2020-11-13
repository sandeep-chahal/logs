export const getUser = () => {
	try {
		const user = JSON.parse(localStorage.getItem("user"));
		if (typeof user === "string") return null;
		else return user;
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
