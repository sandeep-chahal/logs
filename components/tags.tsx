const tags = ["javascript", "web", "tech", "nextjs", "nodejs", "reactjs"];

const Tags = () => {
	return (
		<div className="bg-white p-4 text-black fixed w-64">
			<h3 className="text-2xl font-bold mb-3">Tags</h3>
			<ul>
				{tags.map((tag) => (
					<li
						key={tag}
						className="mb-2 cursor-pointer text-lg hover:text-primary"
					>
						#{tag}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tags;
