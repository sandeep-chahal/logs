const AddComment = () => {
	return (
		<div className="mb-4">
			<textarea
				id="comment"
				className="block w-full h-24 p-2 border-gray-300 border-2"
				placeholder="What you think?"
			></textarea>
			<button className="outline-none border-none bg-primary shadow-none px-2 py-1 my-2">
				Comment
			</button>
		</div>
	);
};

export default AddComment;
