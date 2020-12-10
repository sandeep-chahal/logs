import { INotf } from "../types/index";
import useSWR from "swr";
import { getNotification } from "../utils/fetch/user";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { log } from "console";

const Notification: React.FC<{ notification: INotf }> = ({ notification }) => {
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
			<a className="p-2 block bg-white mb-4 ml-2">
				{showNotf()}
				<div className="text-sm font-light">
					{dayjs(notification.date).format("dddd, MMMM D YYYY")}
				</div>
			</a>
		</Link>
	);
};

const NotificationViewer = ({ close }: { close: () => void }) => {
	const { data, error } = useSWR<INotf[]>("notifications", getNotification);
	// const listner = useRef<MouseEvent | null>(null);

	useEffect(() => {
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
	}, []);

	return (
		<div
			style={{
				width: "25rem",
				minHeight: "10rem",
			}}
			className="absolute top-auto right-0 rounded bg-white shadow-md font-medium"
		>
			<h3 className="bg-white p-2 shadow-sm">Notifications</h3>
			<div className="h-1"></div>
			{!data ? (
				<div className="mt-3 text-center">loading...</div>
			) : Array.isArray(data) && data.length ? (
				data.map((notification, i) => (
					<Notification notification={notification} key={i} />
				))
			) : (
				<div className="mt-3 text-center">No notification</div>
			)}
		</div>
	);
};

export default NotificationViewer;
