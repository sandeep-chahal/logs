import Link from "next/link";

const Home = () => {
	return (
		<div>
			<h1 className="text-center text-yellow-500">Work In Progress</h1>
			<Link href="/post/5f9d4807deb75c1f10798c7b">
				<a className="bg-white p-2 my-5 text-center block">Open a dummy blog</a>
			</Link>
		</div>
	);
};

export default Home;
