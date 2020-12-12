import { TYPES } from "./actions";

export const initialState = {
	user: null,
	post: null,
	isClient: false,
	hasNotif: false,
	modal: false,
	modalData: null,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_USER:
			return {
				...state,
				user: action.payload.user,
			};
		case TYPES.SET_HAS_NOTIF:
			return {
				...state,
				hasNotif: action.payload.has,
			};
		case TYPES.SHOW_MODAL:
			return {
				...state,
				modal: action.payload.open,
				modalData: action.payload.data,
			};
		default:
			return state;
	}
};

export default reducer;
