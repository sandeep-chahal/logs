import { TYPES } from "./actions";

export const initialState = {
	user: null,
	post: null,
	isClient: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_USER:
			return {
				...state,
				user: action.payload.user,
			};
		default:
			return state;
	}
};

export default reducer;
