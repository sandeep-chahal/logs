import { useEffect, useState } from "react";
import { getUser } from "../utils";

const Navbar = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	useEffect(() => {
		setUser(getUser());
		setLoading(false);
	}, []);
	return (
		<nav className="flex justify-between h-12 items-center px-20 bg-white">
			<h2 className="text-2xl">
				<span className="font-light">Dev|</span>
				<span className="font-bold">Logs</span>
			</h2>
			<div className="flex items-center">
				<img className="cursor-pointer mx-4 w-6" src="/icons/search-1.svg" />
				<button className=" rounded cursor-pointer mx-4 bg-primary px-4 py-1 pt-2">
					Write Post
				</button>
				<img
					className="cursor-pointer mx-4 w-6"
					src="/icons/notification-1.svg"
				/>
				{loading ? (
					<svg
						className="mx-4 animate-spin h-5 w-5 mr-3 rounded-full border-black border-t-2"
						viewBox="0 0 24 24"
					></svg>
				) : user ? (
					<img className="mx-4 h-8 w-8 rounded-full" src={user.photo} />
				) : (
					<div className="mx-4 cursor-pointer">Login</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
