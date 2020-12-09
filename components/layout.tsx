import React, { useEffect } from "react";
import Navbar from "./navbar";
import { useStore } from "../store/";
import { setHasNotf } from "../store/actions";

type IData = {
	error: boolean;
	data: boolean;
};

const Layout: React.FC = ({ children }) => {
	const [_, dispatch] = useStore();
	useEffect(() => {
		fetch("/api/user/has-notf")
			.then((res) => res.json())
			.then((res: IData) => {
				if (!res.error && res.data) {
					dispatch(setHasNotf(true));
				}
			});
	}, []);
	return (
		<div className="relative">
			<div className="mb-20">
				<Navbar />
			</div>
			{children}
		</div>
	);
};

export default Layout;
