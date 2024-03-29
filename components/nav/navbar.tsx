import React, { useState } from "react";
import { useStore } from "../../store";
import Link from "next/link";
import { setHasNotif } from "../../store/actions";
import { AnimatePresence } from "framer-motion";
import useWindowSize from "../../utils/hooks/useWindowSize";
import DesktopNav from "./desktopNav";
import Hamburger from "./hamburger";
import MobileNav from "./mobileNav";

const Navbar = () => {
	const [state, dispatch] = useStore();
	const [notifOpen, setNotifOpen] = useState(false);
	const [dropDown, setDropDown] = useState(false);
	const { width } = useWindowSize();

	const handleNotifOpen = () => {
		setNotifOpen((prev) => {
			if (prev) {
				setDropDown(false);
			}
			return !prev;
		});
		dispatch(setHasNotif(false));
	};

	const toggleDropDown = () => {
		if (!width || width > 768) return;
		setDropDown((prev) => !prev);
		setNotifOpen(false);
	};

	return (
		<header className="flex flex-col fixed top-0 left-0 w-full z-40">
			<nav className="flex justify-between h-12 items-center pl-5 shadow-md md:px-20 bg-white w-full">
				<Link href="/">
					<a onClick={() => setDropDown(false)}>
						<h2 className="text-2xl ">
							<span className="font-light">Dev|</span>
							<span className="font-bold">Logs</span>
						</h2>
					</a>
				</Link>
				{width && width > 768 ? (
					<DesktopNav
						handleNotifOpen={handleNotifOpen}
						hasNotif={state.hasNotif}
						notifOpen={notifOpen}
						setNotifOpen={setNotifOpen}
						user={state.user}
					/>
				) : null}
				{width && width < 768 ? (
					<Hamburger dropDown={dropDown} toggleDropDown={toggleDropDown} />
				) : null}
			</nav>
			<AnimatePresence>
				{dropDown && width && width < 768 ? (
					<MobileNav
						handleNotifOpen={handleNotifOpen}
						notifOpen={notifOpen}
						toggleDropDown={toggleDropDown}
						user={state.user}
					/>
				) : null}
			</AnimatePresence>
		</header>
	);
};

export default Navbar;
