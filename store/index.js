import { useReducer, useContext, createContext } from "react";
import reducer, { initialState } from "./reducer";
import { getUser } from "../utils/";

const StateContext = createContext();
const DispatchContext = createContext();

export const Provider = ({ children }) => {
	if (typeof window !== "undefined") initialState.user = getUser();
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

export const useState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
