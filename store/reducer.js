import { TYPES } from "./actions";

export const initialState = {
	user: null,
	loadingUser: true,
	post: null,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_USER:
			return {
				...state,
				user: action.payload.user,
				loadingUser: false,
			};
		default:
			return state;
	}
};

export default reducer;
