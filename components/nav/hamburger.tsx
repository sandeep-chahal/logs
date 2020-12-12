import { motion } from "framer-motion";

interface IProps {
	dropDown: boolean;
	toggleDropDown: () => void;
}

const Hamburger = ({ dropDown, toggleDropDown }: IProps) => {
	return (
		<section
			id="hamburger"
			className="mr-3 relative flex flex-col items-end"
			onClick={toggleDropDown}
		>
			<motion.div
				key="line-1"
				animate={{
					transform: `rotate(${dropDown ? 45 : 0}deg) translateY(${
						dropDown ? "135%" : "0%"
					})`,
				}}
				className="w-6 h-1 bg-black mb-1 rounded-full"
			></motion.div>
			<motion.div
				key="line-2"
				animate={{
					transform: `rotate(${dropDown ? -45 : 0}deg) translateY(${
						dropDown ? "-135%" : "0%"
					})`,
					width: `${dropDown ? "1.5rem" : "1rem"}`,
				}}
				className="w-4 h-1 bg-black rounded-full"
			></motion.div>
		</section>
	);
};

export default Hamburger;
