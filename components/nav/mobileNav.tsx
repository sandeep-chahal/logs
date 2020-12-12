import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NotificationViewer from "../notificationViewer";
import { IUser } from "../../models/user";
import useWindowSize from "../../utils/hooks/useWindowSize";

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
	const { width } = useWindowSize();
	if (width > 768 || width === 0) return null;
	return (
		<motion.div
			key="mobile-nav"
			className="bg-white h-64 p-4 border-t-2 font-medium text-xl flex flex-col md:hidden"
			style={{ originY: 0 }}
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
		>
			<Link href="/search">
				<a onClick={toggleDropDown} className="mb-4">
					Search
				</a>
			</Link>
			<Link href="/post/add">
				<a onClick={toggleDropDown} className="mb-4">
					Write Post
				</a>
			</Link>
			<div className="mb-4">
				<span onClick={handleNotifOpen}>Notifications</span>
				<span id="notification">
					{notifOpen ? (
						<AnimatePresence>
							<NotificationViewer close={handleNotifOpen} />
						</AnimatePresence>
					) : null}
				</span>
			</div>
			<Link href={user ? "/profile/me" : "/api/auth/github"}>
				<a onClick={toggleDropDown} className="mb-4">
					{user ? user.name : "Login with Github"}
				</a>
			</Link>
		</motion.div>
	);
};

export default MobileNav;
