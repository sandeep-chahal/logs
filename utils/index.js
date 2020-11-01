export const getUser = () => JSON.parse(localStorage.getItem("user"));
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
