import Navbar from "./navbar";

export default function Layout({ children }) {
	return (
		<div className="relative">
			<div className="mb-20">
				<Navbar />
			</div>
			{children}
		</div>
	);
}
