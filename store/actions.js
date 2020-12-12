export const TYPES = {
	SET_USER: "SET_USER",
	SET_HAS_NOTIF: "SET_HAS_NOTIF",
	SHOW_MODAL: "SHOW_MODAL",
};

export const setUser = (user) => {
	return {
		type: TYPES.SET_USER,
		payload: {
			user,
		},
	};
};
export const setHasNotif = (has) => {
	return {
		type: TYPES.SET_HAS_NOTIF,
		payload: {
			has,
		},
	};
};
export const showModal = (open, data) => {
	return {
		type: TYPES.SHOW_MODAL,
		payload: {
			open,
			data,
		},
	};
};
