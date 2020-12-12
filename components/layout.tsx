import React, { useEffect } from "react";
import Navbar from "./nav/navbar";
import { useStore } from "../store/";
import { setHasNotif, showModal } from "../store/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "./modal";

type IData = {
	error: boolean;
	data: boolean;
};

const Layout: React.FC = ({ children }) => {
	const router = useRouter();
	const [state, dispatch] = useStore();
	useEffect(() => {
		fetch("/api/user/has-notf")
			.then((res) => res.json())
			.then((res: IData) => {
				if (!res.error && res.data) {
					dispatch(setHasNotif(true));
				}
			});
	}, []);

	const closeModal = () => {
		dispatch(showModal(false, null));
	};

	return (
		<div className="relative">
			<div className="mb-16 md:mb-20">
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
			<AnimatePresence>
				{state.modal ? (
					<Modal data={state.modalData} close={closeModal} />
				) : null}
			</AnimatePresence>
		</div>
	);
};

export default Layout;
