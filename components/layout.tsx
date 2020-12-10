import React, { useEffect } from "react";
import Navbar from "./navbar";
import { useStore } from "../store/";
import { setHasNotf } from "../store/actions";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

type IData = {
	error: boolean;
	data: boolean;
};

const Layout: React.FC = ({ children }) => {
	const router = useRouter();
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
			<motion.main
				key={router.route}
				initial="pageInitial"
				animate="pageAnimate"
				variants={{
					pageInitial: {
						opacity: 0,
					},
					pageAnimate: {
						opacity: 1,
					},
				}}
			>
				{children}
			</motion.main>
		</div>
	);
};

export default Layout;
