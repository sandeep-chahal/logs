import { TYPES } from "./actions";

export const initialState = {
	user: null,
	post: null,
	isClient: false,
	hasNotf: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_USER:
			return {
				...state,
				user: action.payload.user,
			};
		case TYPES.SET_HAS_NOTF:
			return {
				...state,
				hasNotf: action.payload.has,
			};
		default:
			return state;
	}
};

export default reducer;
