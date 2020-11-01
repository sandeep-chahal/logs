export const getUser = () => JSON.parse(localStorage.getItem("user"));
export const formatNumber = (num) =>
	num < 1000 ? num : num < 1000000 ? num / 1000 + "K" : num / 1000000 + "M";
