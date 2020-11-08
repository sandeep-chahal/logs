import { useReducer, useContext, createContext } from "react";
import reducer, { initialState } from "./reducer";
import { getUser } from "../utils/";

const Context = createContext();

export const Provider = ({ children }) => {
	if (typeof window !== "undefined") {
		initialState.user = getUser();
		initialState.isClient = true;
	}
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
	);
};

export const useStore = () => useContext(Context);
