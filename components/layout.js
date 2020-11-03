import { useEffect } from "react";
import Navbar from "./navbar";

import { useDispatch } from "../store";
import { TYPES, setUser } from "../store/actions";
import { getUser } from "../utils";

export default function Layout({ children }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setUser(getUser()));
	}, []);
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}
