import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

const Cursor = () => {
	const cursorX = useMotionValue(-100);
	const cursorY = useMotionValue(-100);

	useEffect(() => {
		const moveCursor = (e: MouseEvent) => {
			cursorX.set(e.clientX - 16);
			cursorY.set(e.clientY - 16);
		};

		window.addEventListener("mousemove", moveCursor);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
		};
	}, []);

	return (
		<motion.div
			className="cursor"
			style={{
				translateX: cursorX,
				translateY: cursorY,
			}}
		/>
	);
};

export default Cursor;
