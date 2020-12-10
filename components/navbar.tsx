import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../store";
import { useRouter } from "next/router";
import Link from "next/link";
import NotificationViewer from "../components/notficationViewer";
import { setHasNotf } from "../store/actions";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
	const [state, dispatch] = useStore();
	const [notfOpen, setNotfOpen] = useState(false);
	const router = useRouter();

	const handleNotfOpen = () => {
		setNotfOpen((prev) => !prev);
		dispatch(setHasNotf(false));
	};
	return (
		<nav className="flex justify-between h-12 items-center px-20 bg-white shadow-md fixed top-0 left-0 w-full z-50">
			<Link href="/">
				<a>
					<h2 className="text-2xl cursor-pointer">
						<span className="font-light">Dev|</span>
						<span className="font-bold">Logs</span>
					</h2>
				</a>
			</Link>
			<div className="flex items-center">
				<Link href="/search">
					<a>
						<img
							className="cursor-pointer mx-4 w-6"
							src="/icons/search-1.svg"
						/>
					</a>
				</Link>
				<Link href="/post/add">
					<a className=" rounded cursor-pointer mx-4 bg-gradient-1 px-4 py-1 text-white font-semibold">
						Write Post
					</a>
				</Link>
				<div
					id="notification"
					onClick={handleNotfOpen}
					className="relative w-6 mx-4"
					title={
						state.hasNotf
							? "You have some notifications"
							: "No new notification"
					}
				>
					<img
						className="cursor-pointer w-full"
						src="/icons/notification-1.svg"
					/>
					{state.hasNotf ? (
						<div className="absolute w-2 h-2 bg-primary right-0 top-0 rounded-full"></div>
					) : null}
					<AnimatePresence>
						{notfOpen ? (
							<NotificationViewer close={() => setNotfOpen(false)} />
						) : null}
					</AnimatePresence>
				</div>
				{state.userloading ? (
					<svg
						className="mx-4 animate-spin h-5 w-5 mr-3 rounded-full border-darkBlue border-t-2"
						viewBox="0 0 24 24"
					></svg>
				) : state.user ? (
					<Link href="/profile/me">
						<a>
							<div className="w-8 h-8">
								<Image
									width="35px"
									height="35px"
									quality={50}
									// onClick={() => router.push(`/profile/${state.user._id}`)}
									className="object-cover object-center rounded-full"
									src={state.user.photo}
									alt="user image"
								/>
							</div>
						</a>
					</Link>
				) : (
					<div
						className="mx-4 cursor-pointer font-medium"
						onClick={() => router.push("/api/auth/github")}
					>
						Login with Github
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
