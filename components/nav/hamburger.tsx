import { motion } from "framer-motion";

interface IProps {
	dropDown: boolean;
	toggleDropDown: () => void;
}

const Hamburger = ({ dropDown, toggleDropDown }: IProps) => {
	return (
		<section id="hamburger" className="mr-3 relative" onClick={toggleDropDown}>
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
				}}
				className="w-6 h-1 bg-black rounded-full"
			></motion.div>
		</section>
	);
};

export default Hamburger;
