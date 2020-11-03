export const TYPES = {
	SET_USER: "SET_USER",
};

export const setUser = (user) => {
	return {
		type: TYPES.SET_USER,
		payload: {
			user,
		},
	};
};
