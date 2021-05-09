import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import NotificationViewer from "../notificationViewer";
import { IUser } from "../../models/user";

interface IProps {
	setNotifOpen: (a: boolean) => void;
	handleNotifOpen: () => void;
	hasNotif: boolean;
	notifOpen: boolean;
	user: IUser;
}

const DesktopNav = ({
	handleNotifOpen,
	hasNotif,
	notifOpen,
	setNotifOpen,
	user,
}: IProps) => {
	const router = useRouter();

	return (
		<div key="desktop-nav-wrapper hidden md:block">
			<div key="desktop-nav" className="desktop-nav items-center flex">
				<Link href="/search">
					<a>
						<img
							className="cursor-pointer mx-4 w-6"
							src="/icons/search-1.svg"
						/>
					</a>
				</Link>
				{user &&
					(new Date(user.subscription.expiresOn || 0) < new Date() ? (
						<Link href="/subscription">
							<a
								className="font-bold text-primary border-b-2 border-transparent hover:border-primary"
								href="/subscription"
							>
								Buy Pro
							</a>
						</Link>
					) : (
						<div className="border-b-2 border-secondary px-2">Pro 😎</div>
					))}
				<Link href="/post/add">
					<a className="rounded cursor-pointer mx-4 bg-gradient-1 px-4 py-1 text-white font-semibold">
						Write Post
					</a>
				</Link>
				<div
					id="notification"
					onClick={handleNotifOpen}
					className="relative w-6 mx-4"
					title={
						hasNotif ? "You have some notifications" : "No new notification"
					}
				>
					<img
						className="cursor-pointer w-full"
						src="/icons/notification-1.svg"
					/>
					{hasNotif ? (
						<div className="absolute w-2 h-2 bg-primary right-0 top-0 rounded-full"></div>
					) : null}
					<AnimatePresence>
						{notifOpen ? (
							<NotificationViewer close={() => setNotifOpen(false)} />
						) : null}
					</AnimatePresence>
				</div>
				{user ? (
					<Link href="/profile/me">
						<a>
							<div className="w-8 h-8">
								<Image
									width="35px"
									height="35px"
									quality={50}
									className="object-cover object-center rounded-full"
									src={user.photo}
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
		</div>
	);
};

export default DesktopNav;
