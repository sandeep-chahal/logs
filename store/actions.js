export const TYPES = {
	SET_USER: "SET_USER",
	SET_HAS_NOTF: "SET_HAS_NOTF",
};

export const setUser = (user) => {
	return {
		type: TYPES.SET_USER,
		payload: {
			user,
		},
	};
};
export const setHasNotf = (has) => {
	return {
		type: TYPES.SET_HAS_NOTF,
		payload: {
			has,
		},
	};
};
