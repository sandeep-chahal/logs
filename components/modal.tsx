import { motion } from "framer-motion";

export interface IModalData {
	primaryBtn?: string;
	msg: string;
	type: "ERROR" | "SUCCESS";
}
interface IProps {
	data: IModalData;
	close: () => void;
}

const Modal: React.FC<IProps> = ({ data, close }) => {
	return (
		// wrapper
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			style={{
				background: "rgba(0,0,0,0.15)",
				zIndex: 45,
			}}
			className="fixed top-0 left-0 w-screen h-screen overflow-hidden flex items-center justify-center"
		>
			{/* modal */}
			<motion.div
				initial={{ transform: "scale(0.75) translateY(100px)" }}
				animate={{ transform: "scale(1) translateY(0px)" }}
				exit={{ transform: "scale(0.5) translateY(120vh)" }}
				className="p-4 bg-white w-1/4 rounded font-medium text-center z-50"
			>
				<img
					className="w-1/2 m-auto mb-5"
					src={data.type === "ERROR" ? "/fatal-error.svg" : "/success.svg"}
				/>
				<p className="mb-5">{data.msg}</p>
				<div>
					<button
						autoFocus
						className="font-medium bg-gradient-1 p-2 px-3 text-white inline-block m-auto"
						onClick={close}
					>
						{data.primaryBtn || "Okay!"}
					</button>
				</div>
			</motion.div>
			{/* modal */}
		</motion.div>
		// wrapper
	);
};

export default Modal;
