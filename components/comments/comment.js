import { useState } from "react";
import dayjs from "dayjs";

export default ({ userId, comment, deleteComment }) => {
	const [btnDisable, setBtnDisable] = useState(false);

	const handleClick = () => {
		deleteComment(comment._id, setBtnDisable);
	};

	return (
		<div className="bg-pureWhite p-3 mb-6">
			<div className="flex justify-between">
				<div className="text-xl">{comment.by_user.name}</div>
				{userId === comment.by_user._id ? (
					<img
						title={
							btnDisable
								? "wait for the operation to be done"
								: "Click to delete it."
						}
						className={`w-4  ${
							btnDisable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
						} `}
						src="/icons/delete-bin.svg"
						onClick={handleClick}
					/>
				) : null}
			</div>
			<div className="text-xs font-light border-b border-black inline-block border-opacity-25">
				{dayjs(comment.date).format("dddd, MMMM D YYYY")}
			</div>
			<p className="mt-2 whitespace-pre-wrap	">{comment.content}</p>
		</div>
	);
};
