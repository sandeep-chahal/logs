import { INotf } from "../types/index";
import useSWR from "swr";
import { getNotification } from "../utils/fetch/user";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Notification: React.FC<{ notification: INotf; close: () => void }> = ({
	notification,
	close,
}) => {
	const showNotf = () => {
		if (notification.type === "follow")
			return (
				<>
					<div>
						<span className="font-bold">{notification.from.name}</span> started
						following you.
					</div>
				</>
			);
		return (
			<>
				<span className="font-bold">{notification.from.name}</span> commented on{" "}
				<span className="font-bold">{notification.post?.title}</span>
			</>
		);
	};
	return (
		<Link
			href={
				notification.type === "follow"
					? "/user/" + notification.from.id
					: "/post/" + notification.post?.id
			}
		>
			<a className="p-2 block bg-white mb-4 ml-2" onClick={close}>
				{showNotf()}
				<div className="text-sm font-light">
					{dayjs(notification.date).format("dddd, MMMM D YYYY")}
				</div>
			</a>
		</Link>
	);
};

const NotificationViewer = ({ close }: { close: () => void }) => {
	const { data, error } = useSWR<INotf[]>("notifications", getNotification, {
		focusThrottleInterval: 5000,
	});

	useEffect(() => {
		// only if mot on mobile
		if (typeof window !== "undefined" && window.innerWidth > 768) {
			const handleListner = (e: MouseEvent) => {
				// @ts-ignore
				if (!e.path.some((el) => el.id == "notification")) {
					close();
				}
			};
			document.body.addEventListener("click", handleListner);
			return function cleanup() {
				document.body.removeEventListener("click", handleListner);
			};
		}
	}, []);

	return (
		<motion.div
			style={{ originY: 0 }}
			initial={{
				scaleY: 0,
				opacity: 0,
			}}
			animate={{
				scaleY: 1,
				opacity: 1,
			}}
			exit={{
				scaleY: 0,
				opacity: 0.5,
				transition: {
					duration: 0.15,
				},
			}}
			className="absolute top-50 md:top-auto px-4 right-0 rounded bg-white shadow-md font-medium z-50 w-full md:w-auto"
		>
			<h3 className="bg-white p-2 shadow-sm">Notifications</h3>
			<div className="h-1"></div>
			<div
				style={{
					height: "60vh",
				}}
				className="notification overflow-scroll overflow-x-hidden min-h-screen md:min-h-full"
			>
				{!data && !error ? (
					<div className="mt-3 text-center">loading...</div>
				) : null}
				{error ? (
					<div className="mt-3 text-center">
						{typeof error === "string" ? error : "Something went wrong!"}
					</div>
				) : null}
				{!data ? null : Array.isArray(data) && data.length ? (
					data.map((notification, i) => (
						<Notification close={close} notification={notification} key={i} />
					))
				) : (
					<div className="mt-3 text-center">No notification</div>
				)}
			</div>
		</motion.div>
	);
};

export default NotificationViewer;
