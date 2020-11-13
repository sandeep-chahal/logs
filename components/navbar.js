import { useStore } from "../store";
import { useRouter } from "next/router";

const Navbar = () => {
	const [state, dispatch] = useStore();
	const router = useRouter();
	return (
		<nav className="flex justify-between h-12 items-center px-20 bg-white">
			<h2 className="text-2xl cursor-pointer" onClick={() => router.push("/")}>
				<span className="font-light">Dev|</span>
				<span className="font-bold">Logs</span>
			</h2>
			<div className="flex items-center">
				<img className="cursor-pointer mx-4 w-6" src="/icons/search-1.svg" />
				<button
					className=" rounded cursor-pointer mx-4 bg-primary px-4 py-1 pt-2"
					onClick={() => {
						if (state.user) router.push("/post/add");
						else router.push("/api/auth/github");
					}}
				>
					Write Post
				</button>
				<img
					className="cursor-pointer mx-4 w-6"
					src="/icons/notification-1.svg"
				/>
				{state.userloading ? (
					<svg
						className="mx-4 animate-spin h-5 w-5 mr-3 rounded-full border-black border-t-2"
						viewBox="0 0 24 24"
					></svg>
				) : state.user ? (
					<img
						onClick={() => router.push(`/profile/${state.user._id}`)}
						className="mx-4 h-8 w-8 cursor-pointer rounded-full object-cover object-center"
						src={state.user.photo}
					/>
				) : (
					<div
						className="mx-4 cursor-pointer"
						onClick={() => router.push("/api/auth/github")}
					>
						Login
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
