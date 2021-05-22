import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const Comment = ({ userId, comment, deleteComment }) => {
	const [btnDisable, setBtnDisable] = useState(false);

	const handleClick = () => {
		deleteComment(comment._id, setBtnDisable);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white p-3 mb-6 border-l-2 border-secondary bg-gradient-2"
		>
			<div className="flex justify-between">
				<Link href={`/profile/${comment.by_user._id}`}>
					<a className="text-lg capitalize hover:text-primary transition-1">
						{comment.by_user.name}
					</a>
				</Link>
				{userId === comment.by_user._id ? (
					<img
						title={
							btnDisable
								? "wait for the operation to be done"
								: "Click to delete it."
						}
						className={`w-4  ${
							btnDisable ? "opacity-50 cursor-not-allowed" : ""
						} `}
						src="/icons/delete-bin.svg"
						onClick={handleClick}
					/>
				) : null}
			</div>
			<div className="text-xs font-light border-b border-darkBlue inline-block border-opacity-25">
				{dayjs(comment.date).format("dddd, MMMM D YYYY")}
			</div>
			<p className="mt-2 whitespace-pre-wrap text-xl font-medium">
				{comment.content}
			</p>
		</motion.div>
	);
};

export default Comment;
