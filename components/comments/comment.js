import dayjs from "dayjs";

export default ({ comment }) => {
	return (
		<div className="bg-pureWhite p-3">
			<div className="text-xl">{comment.by_user.name}</div>
			<div className="text-xs font-light">
				{dayjs(comment.date).format("dddd, MMMM D YYYY")}
			</div>
			<div className="mt-2">{comment.content}</div>
		</div>
	);
};
