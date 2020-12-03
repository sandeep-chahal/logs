import React from "react";
import Navbar from "./navbar";

const Layout: React.FC = ({ children }) => {
	return (
		<div className="relative">
			<div className="mb-20">
				<Navbar />
			</div>
			{children}
		</div>
	);
};

export default Layout;
