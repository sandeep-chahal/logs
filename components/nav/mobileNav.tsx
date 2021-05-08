import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NotificationViewer from "../notificationViewer";
import { IUser } from "../../models/user";

interface IProps {
	toggleDropDown: () => void;
	handleNotifOpen: () => void;
	notifOpen: boolean;
	user: IUser;
}

const MobileNav = ({
	toggleDropDown,
	handleNotifOpen,
	notifOpen,
	user,
}: IProps) => {
	return (
		<motion.div
			style={{ background: "rgba(0,0,0,0.25)" }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-screen h-screen"
		>
			<motion.div
				className="bg-white h-64 p-4 border-t-2 font-medium text-xl flex flex-col md:hidden shadow-md z-50"
				style={{ originY: 0 }}
				initial={{ height: 0 }}
				animate={{ height: "auto" }}
				exit={{ height: 0 }}
			>
				<Link href="/search">
					<a onClick={toggleDropDown} className="mb-4 flex">
						<img src="/icons/search-1.svg" width="25px" className="mr-4" />{" "}
						<span>Search</span>
					</a>
				</Link>

				<Link href="/post/add">
					<a onClick={toggleDropDown} className="mb-4 flex">
						<img src="/icons/pencil.svg" width="25px" className="mr-4" />
						<span>Write Post</span>
					</a>
				</Link>
				<div className="mb-4">
					<span onClick={handleNotifOpen} className="flex">
						<img
							src="/icons/notification-1.svg"
							width="25px"
							className="mr-4"
						/>
						<span>Notifications</span>
					</span>
					<span id="notification">
						{notifOpen ? (
							<AnimatePresence>
								<NotificationViewer close={handleNotifOpen} />
							</AnimatePresence>
						) : null}
					</span>
				</div>
				<Link href={user ? "/profile/me" : "/api/auth/github"}>
					<a onClick={toggleDropDown} className="mb-4 flex capitalize">
						<img src="/icons/popeye.svg" width="25px" className="mr-4" />
						<span> {user ? user.name : "Login with Github"}</span>
						<span className="ml-2">
							{user && new Date(user.subscription.expiresOn) > new Date()
								? "(PRO)"
								: ""}
						</span>
					</a>
				</Link>
				{user && new Date(user.subscription.expiresOn) < new Date() ? (
					<Link href="/subscription">
						<a
							className="text-center font-bold text-primary border-b-2 border-transparent hover:border-primary"
							href="/subscription"
						>
							Buy Pro
						</a>
					</Link>
				) : null}
			</motion.div>
		</motion.div>
	);
};

export default MobileNav;
