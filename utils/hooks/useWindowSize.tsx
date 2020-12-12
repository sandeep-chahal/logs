import React from "react";
export default function useWindowSize() {
	const isSSR = typeof window === "undefined";
	const [windowSize, setWindowSize] = React.useState({
		width: isSSR ? null : window.innerWidth,
		height: isSSR ? null : window.innerHeight,
	});

	function changeWindowSize() {
		setWindowSize({ width: window.innerWidth, height: window.innerHeight });
	}

	React.useEffect(() => {
		window.addEventListener("resize", changeWindowSize);

		return () => {
			window.removeEventListener("resize", changeWindowSize);
		};
	}, []);

	return windowSize;
}
